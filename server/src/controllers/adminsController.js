const COLORS = require("../constants/colors");
const SIZES = require("../constants/sizes");
const fs = require("fs")
const ItemsImages = require("../models/clothesModels/imagesModel");
const ItemsDetails = require("../models/clothesModels/itemsDetailsModel");
const Items = require("../models/clothesModels/itemsModel");
const OrderItems = require("../models/orderModels/orderItemsModel");
const Order = require("../models/orderModels/orderModel");
const Users = require("../models/userModels/usersModel");
const { Op } = require("sequelize");

const { supabase } = require("../utils/supabase");


exports.allowAccess = async (req, res, next) => {
   const { sessionToken, roles } = req.user;

   return res.status(200).json({
      roles,
      sessionToken,
   });
};

exports.listServedItems = async (req, res, next) => {
   const { roles } = req.user;
   const { from, to } = req.query;

   if (!roles.includes("finance")) {
      const error = new Error("You are not allowed to visit this route.");
      error.status = 401;
      return next(error);
   }

   if (!(from && to)) {
      const error = new Error("You have to specify the 'from' and the 'to' or both.");
      error.status = 400;
      return next(error);
   }
   
   try {
      
      const exclude = ["createdAt", "updatedAt"];

      const orders = await Order.findAll({
         where: {
            served: true,
            updatedAt: {
               [Op.between]: [from, to]
            },
         },
         attributes: { exclude: ["served", "user_id", "updatedAt"] },
         include: {
            model: Users,
            attributes: { exclude: ["nearestPoI", "district", "id", ...exclude] },
         },
      });

      const result = orders.map(async (order) => {
         const newOrders = {...order.dataValues};
         newOrders.orderItems = await OrderItems.findAll({
            where: { order_id: order.id },
            attributes: ["item_count", "total_price"],
            include: {
               model: ItemsDetails,
               attributes: ["size", "color"],
               include: {
                  model: Items,
                  attributes: ["id", "name", "price", "section", "type"],
               }
            }
         });
         return newOrders;
      });

      const allOrders = await Promise.all(result);

      return res.status(200).json(allOrders);

   } catch (e) {
      return next(e);
   }
};

exports.listPendingItems = async (req, res, next) => {
   const { roles } = req.user;
   const { country, city } = req.query;

   if (!roles.includes("orders")) {
      const error = new Error("You are not allowed to visit this route.");
      error.status = 401;
      return next(error);
   }

   if (!(country && city)) {
      const error = new Error("You have to specify the country or the city or both.");
      error.status = 400;
      return next(error);
   }

   try {
      const orders = await Order.findAll({
         where: {
            served: false,
         },
         attributes: { exclude: ["served", "user_id", "updatedAt"] },
         include: {
            model: Users,
            attributes: { exclude: ["id", "createdAt", "updatedAt"] },
         },
      });
   
      const result = orders.map(async (order) => {
         if (order.user.country !== country || order.user.city !== city) {
            return;
         }
         const newOrders = {...order.dataValues};
         newOrders.orderItems = await OrderItems.findAll({
            where: { order_id: order.id },
            attributes: ["item_count", "total_price"],
            include: {
               model: ItemsDetails,
               attributes: ["size", "color"],
               include: {
                  model: Items,
                  attributes: ["Id", "name", "price", "section", "type"],
               }
            }
         });
         return newOrders;
      });

      const allOrders = await Promise.all(result);

      return res.status(200).json(allOrders);

   } catch (e) {
      return next(e);
   }
};

exports.addNewItem = async (req, res, next) => {
   const { sessionToken, roles } = req.user;
   const { name, price, section, type, details } = JSON.parse(req.body.json);
   
   let item;
   try {
      if (!roles.includes("uploading")) {
         const error = new Error("You are not allowed to visit this route.");
         error.status = 401;
         throw error;
      }

      if (!(name && price && section && type && (details && details.length > 0))) {
         const error = new Error("Missing Information. Please try again.");
         error.status = 400;
         throw error;
      }   

      if (!(/^\d+(\.)+\d{1,2}$/.test(price))) {
         const error = new Error("price has to be a decimal number with 2 digits after the dot (example: 20.50)");
         error.status = 400;
         throw error;
      }

      const allowCreate = details.every(obj => {
         if (!COLORS.includes(obj.color)) {
            return false;
         }
         return obj.sizes.every(elm => elm.stock > 0 && elm.stock % 1 === 0 && SIZES.includes(elm.size));
      });

      if (!allowCreate) {
         const error = new Error("Information provided are wrong");
         error.status = 400;
         throw error;
      }

      if (!req.files.images || req.files.images.length !== 3) {
         const error = new Error("Exacly 3 files required.");
         error.status = 400;
         throw error;
      }
   
      const files = req.files.images;
      const fileNames = files.map((file) => Date.now() + "-" + file.originalname);
      const fileBuffers = files.map((file) => file.buffer);

      const filePromises = fileBuffers.map((fileBuffer, index) => {
         const fileName = fileNames[index];
         return supabase.storage.from("asr_store").upload(`/images/${fileName}`, fileBuffer);
      });
   
      await Promise.all(filePromises);

      item = await Items.create({
         name,
         price,
         image_path: fileNames[0],
         section,
         type,
      });

      let promises = [];

      for (let i = 0; i < 3; i++) {
         const promise = ItemsImages.create({
            item_id: item.id,
            path: fileNames[i],
         });
         promises.push(promise);
      }

      await Promise.all(promises);
      promises = [];

      details.forEach(obj => {
         
         obj.sizes.forEach(async(elm) => {
            const promise = ItemsDetails.create({
               size: elm.size,
               color: obj.color,
               stock: elm.stock,
               item_id: item.id,
            });
            promises.push(promise);
         });
      });
      
      await Promise.all(promises);

      return res.status(200).json({ message: "Item added successfully.", sessionToken });

   } catch (e) {
      try {

         if (req.files.images) {
            for (let i = 0; i < 3; i++) {
               fs.unlink(req.files.images[i].path, (err) => {
                  if (err) throw err;
               });
            }
         }

         if (item) {
            await ItemsImages.destroy({ where: { item_id: item.id } });
            await item.destroy();
         }

      } catch (e) {
         console.log(`Deleting error: ${e}`)
      }

      return next(e);
   }
};

exports.updateStock = async (req, res, next) => {
   const { sessionToken, roles } = req.user;
   const { id, details } = req.body;

   if (!roles.includes("uploading")) {
      const error = new Error("You are not allowed to visit this route.");
      error.status = 401;
      return next(error);
   }

   if (!(id && details)) {
      const error = new Error("Missing Information. Please try again.");
      error.status = 400;
      return next(error);
   }

   const allowCreate = details.every(obj => {
      if (!COLORS.includes(obj.color)) {
         return false;
      }
      return obj.sizes.every(elm => elm.stock > 0 && elm.stock % 1 === 0 && SIZES.includes(elm.size));
   });

   if (!allowCreate) {
      const error = new Error("Information provided are wrong");
      error.status = 400;
      return next(error);
   }

   try {
      let promises = [];
      details.forEach(obj => {
            
         obj.sizes.forEach(async (size) => {
            const promise = ItemsDetails.findOrCreate({
               defaults: {
                  size: size.size,
                  color: obj.color,
                  stock: size.stock,
                  item_id: id,
               },
               where: {
                  item_id: id,
                  color: obj.color,
                  size: size.size
               }
            });
            promises.push(promise);
         });
      });
      
      let results = await Promise.all(promises);

      promises = [];
      let i = 0;
      let createdFlag = false;

      details.forEach(obj => {
         obj.sizes.forEach((size) => {
            const [itemDetail, created] = results[i];
            i++;
            if (created) {
               createdFlag = true;
               return;
            }
            itemDetail.stock = itemDetail.stock + size.stock;
            promises.push(itemDetail.save());
         })
      });

      results = await Promise.all(promises);
   
      const isUpdated = results.length || createdFlag;
   
      if (!isUpdated) {
         const error = new Error("Nothing got updated.");
         error.status = 400;
         return next(error);
      }
   
      await Items.update({ available: true }, { where: { id, available: false } });
   
      res.status(200).json({ message: "Updated", sessionToken });
   } catch (e) {
      return next(e);
   }

};