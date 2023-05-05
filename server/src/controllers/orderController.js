const ItemsImages = require("../models/clothesModels/imagesModel");
const ItemsDetails = require("../models/clothesModels/itemsDetailsModel");
const Items = require("../models/clothesModels/itemsModel");
const OrderItems = require("../models/orderModels/orderItemsModel");
const Order = require("../models/orderModels/orderModel");
const Cart = require("../models/userModels/cartModel");
const Users = require("../models/userModels/usersModel");

exports.makeOrder = async (req, res, next) => {
   const { user_id, sessionToken } = req.user;
   const { payment_method, credit_card } = req.body;

   if (!(payment_method && credit_card )) {
      const error = new Error("Missing Information. Please try again.")
      error.status = 400;
      return next(error);
   }

   try {
      
      const cartItems = await Cart.findAll({
         where: { user_id },
         attributes: ["item_count", "total_price", "item_details_id"],
         include: {
            model: ItemsDetails,
            attributes: ["stock", "id", "item_id"],
         }
      });

      if (!cartItems.length) {
         const error = new Error("No cart item founded. Put some items in youe cart before making an order.");
         error.status = 400;
         return next(error);
      }

       let unavalibaleMessage = cartItems.reduce((acc, current) => {
         if (current.itemsDetail.stock >= current.item_count) return acc;
         return acc + ` [only ${current.itemsDetail.stock} instances of the item with id ${current.itemsDetail.id} exsist]`;
      }, "");

      if (unavalibaleMessage) {
         const error = new Error(`Not enough items as following:${unavalibaleMessage}`);
         error.status = 400;
         return next(error);
      }

      const user = await Users.findByPk(user_id, {
         attributes: ["country", "city", "district", "nearestPoI", "phone_number"],
      });

      if (!(user.country && user.city && user.district && user.nearestPoI && user.phone_number)) {
         const error = new Error("User info are not complete. Make sure to submit all information needed");
         error.status = 400;
         return next(error);
      }

      let order_price = cartItems.reduce((acc, current) => acc + parseFloat(current.total_price), 0);

      const order = await Order.create({
         payment_method,
         credit_card: credit_card ? credit_card : null,
         order_price,
         user_id,
      });

      const items = cartItems.map((item) => {
         item = { ...item.dataValues };
         delete item.itemsDetail;
         item.order_id = order.id;
         return item;
      });
      
      await OrderItems.bulkCreate(items);
      
      res.status(200).json({ message: "Order made successfully", sessionToken });

      // run a check to see if more items are available and update accordinglly
      async function onFinish() {
         try {

            await Cart.destroy({ where: { user_id } });

            const item_ids = [];
            await Promise.all(
               cartItems.map(async (item) => {
                  if (!item_ids.includes(item.itemsDetail.item_id)) item_ids.push(item.itemsDetail.item_id);
                  return item.itemsDetail.decrement("stock", { by: item.item_count });
               })
            );
            
            await Promise.all(
               item_ids.map(async (item_id) => {
                  const alltems = await ItemsDetails.findAll({
                     where: { item_id },
                     attributes: ["stock"],
                  });

                  const available = alltems.some((item) => item.stock > 0);
                  if (!available) {
                     console.log("hi in")
                     return Items.update({ available }, { where: { id: item_id } });
                  }
                  return;
               })
            );
                        
         } catch (e) {
            console.log(e)
         }
      }
      res.on("finish", onFinish);

   } catch (e) {
      return next(e);
   }
};

exports.getOrder = async (req, res, next) => {
   const { user_id } = req.user;

   try {
      const order = await Order.findAll({
         where: { user_id },
         attributes: { exclude: ["user_id", "updatedAt"] }
      });

      return res.status(200).json(order);
   } catch (e) {
      return next(e);
   }
};

exports.getOrderDetails = async (req, res, next) => {
   const { id } = req.params;

   if (!id) {
      const error = new Error("Missing Information. Please try again.")
      error.status = 400;
      return next(error);
   }

   try {
      const order = await OrderItems.findAll(
         {
            where: { order_id: id },
            attributes: ["id", "item_count", "total_price"],
            include: {
               model: ItemsDetails,
               attributes: ["size", "color"],
               include: {
                  model: Items,
                  attributes: { exclude: ["available", "createdAt", "updatedAt", "image_path"] },
               },
            },
         },
      );

      const result = order.map(async (orderItem) => {
         const items = { ...orderItem.dataValues };
         items.images = await ItemsImages.findAll({
            where: { item_id: orderItem.itemsDetail.item.id },
            attributes: { exclude: ["id", "item_id", "createdAt", "updatedAt"] }
         });
         return items;
      });

      const orderItems = await Promise.all(result);

      return res.status(200).json(orderItems);
   } catch (e) {
      return next(e);
   }
};
