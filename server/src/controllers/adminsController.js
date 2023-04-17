const COLORS = require("../constants/colors");
const SIZES = require("../constants/sizes");
const fs = require("fs")
const ItemsImages = require("../models/clothesModels/imagesModel");
const ItemsDetails = require("../models/clothesModels/itemsDetailsModel");
const Items = require("../models/clothesModels/itemsModel");
const OrderItems = require("../models/orderModels/orderItemsModel");
const Order = require("../models/orderModels/orderModel");
const Users = require("../models/userModels/usersModel");


exports.allowAccess = async (req, res, next) => {
   const { sessionToken, roles } = req.user;

   return res.status(200).json({
      roles,
      sessionToken,
   });
};

exports.listServedItems = async (req, res, next) => {
   const { user_id, sessionToken, roles } = req.user;
   const { from, to, section, type } = req.query;

   if (!roles.includes("order")) {
      const error = new Error("You are not allowed to visit this route.");
      error.status = 401;
      return next(error);
   }

   if (!(from && to && section && type)) {
      const error = new Error("You have to specify the 'from' and the 'to' or both.");
      error.status = 400;
      return next(error);
   }
   
   try {
      const orders = await Order.findAll({
         where: { served: true },
         attributes: { exclude: ["served"] },
         include: {
            model: Users,
            attributes: { exclude: ["id"] },
         },
      });

      const result = orders.map(async (order) => {

         const orderItems = await OrderItems.findAll({
            where: { order_id: order.id },
            attributes: { exclude: ["id"] },
            include: {
               model: ItemsDetails,
               attributes: { exclude: ["stock"] },
               include: {
                  model: Items,
                  attributes: { exclude: ["image_path", "available"] },
               }
            }
         });

         if (
            ((section && type)
               && section === orderItems.ItemsDetails.Items.section
               && type === orderItems.ItemsDetails.Items.type)
            ||
            ((section && !type) && section === orderItems.ItemsDetails.Items.section)
            ||
            ((!section && type) && type === orderItems.ItemsDetails.Items.type)
            ||
            (!section && !type)
         ) {
            order.orderItems = orderItems;
            return order;
         }

      });

      const allOrders = await Promise.all(result);

      return res.status(200).json({
         sessionToken,
         allOrders,
      });

   } catch (e) {
      return next(e);
   }
};

exports.listPendingItems = async (req, res, next) => {
   const { sessionToken, roles } = req.user;
   const { country, city } = req.query;

   if (!roles.includes("order")) {
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
         attributes: { exclude: ["served"] },
         include: {
            model: Users,
            attributes: { exclude: ["id"] },
         },
      });
   
      const result = orders.map(async (order) => {
         if (order.Users.country !== country || order.User.city !== city) {
            return;
         }
         const orderItems = await OrderItems.findAll({
            where: { order_id: order.id },
            attributes: { exclude: ["id"] },
            include: {
               model: ItemsDetails,
               attributes: { exclude: ["stock"] },
               include: {
                  model: Items,
                  attributes: { exclude: ["image_path", "available"] },
               }
            }
         });
         order.orderItems = orderItems;
         return order;
      });

      const allOrders = await Promise.all(result);
      
      return res.status(200).json({
         sessionToken,
         allOrders,
      });

   } catch (e) {
      return next(e);
   }
};

exports.addNewItem = async (req, res, next) => {
   const { user_id, sessionToken, roles } = req.user;
   const { name, price, section, type, details } = req.body;

   if (!roles.includes("uploading")) {
      const error = new Error("You are not allowed to visit this route.");
      error.status = 401;
      return next(error);
   }

   if (!(name && price && section && type && (details && details.length > 0))) {
      const error = new Error("Missing information.");
      error.status = 400;
      return next(error);
   }   

   const allowCreate = details.every(obj => {
      if (COLORS.includes(obj.color) && obj.stock % 1 === 0 && obj.stock > 0) {
         return obj.sizes.every(size => SIZES.includes(size));
      }
      return false;
   });

   if (!allowCreate) {
      const error = new Error("Information provided are wrong")
   }

   let item;
   try {

      item = await Items.create({
         name,
         price,
         image_path: `/images/${req.files[0].filename}`,
         section,
         type,
      });

      const promises = [];

      for (let i = 0; i < 3; i++) {
         const imagePath = `/images/${req.files[i].filename}`;
         const promise = ItemsImages.create({
            item_id: item.id,
            path: imagePath,
         });
         promises.push(promise);
      }

      await Promise.all(promises);
      promises = [];

      details.forEach(obj => {
         
         obj.sizes.forEach(async(size) => {
            const promise = ItemsDetails.create({
               size,
               color: obj.color,
               stock: obj.stock,
               item_id: item.id,
            });
            promises.push(promise);
         });
      });
      
      await Promise.all(promises);

      return res.status(200).json({ message: "Item added successfully." });

   } catch (e) {
      try {

         if (req.files) {
            for (let i = 0; i < req.files.length; i++) {
               fs.unlink(req.files[i].path, (err) => {
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