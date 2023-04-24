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
         attributes: { exclude: ["user_id", "id"] },
      });

      if (!cartItems.length > 0) {
         const error = new Error("No cart item founded. Put some items in youe cart before making an order.");
         error.status = 400;
         return next(error);
      }

      const user = await Users.findByPk(user_id, {
         attributes: ["adderss", "phone_number"],
      });

      if (!(user.address && user.phone_number)) {
         const error = new Error("User info are not complete. Make sure to submit all information needed");
         error.status = 400;
         return next(error);
      }

      let order_price = 0;
      cartItems.forEach((item) => (order_price += item.total_price));

      const order = await Order.create({
         payment_method,
         credit_card: credit_card ? credit_card : null,
         order_price,
         user_id,
      });

      cartItems = cartItems.map((item) => {
         item.order_id = order.id;
         return item;
      });
      const orderItems = await OrderItems.bulkCreate(cartItems);

      res.status(200).json({ message: "Order made successfully", sessionToken });

      // run a check to see if more items are available and update accordinglly
      function onFinish() {
         try {
            orderItems.map(async (orderItem) => {
               const item = await ItemsDetails.findByPk(orderItem.item_details_id, {
                  attributes: ["stock"],
                  include: {
                     model: Items,
                     attributes: ["id"],
                  },
               });
               await item.decrement({ "stock": orderItem.item_count });

               const items = await ItemsDetails.findAll({
                  where: { item_id: item.Item.id },
                  attributes: ["stock"],
               });

               const available = items.some((item) => item.stock > 0);
               if (!available) {
                  await Items.update({ available }, { where: { id: item.Item.id } });
               }
            });
         } catch (e) {
            onFinish();
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
         attributes: { exclude: ["user_id"] }
      });

      return res.status(200).json(order);
   } catch (e) {
      return next(e);
   }
};

exports.getOrderDetails = async (req, res, next) => {
   const { id } = req.query;

   if (!order_id) {
      const error = new Error("Missing Information. Please try again.")
      error.status = 400;
      return next(error);
   }

   try {
      const order = await OrderItems.findAll(
         {
            where: { order_id },
            attributes: { exclude: ["order_id", "item_details_id"] },
            include: {
               model: ItemsDetails,
               attributes: { exclude: ["stock", "id", "item_id"] },
               include: {
                  model: Items,
                  attributes: { exclude: ["id", "available", "image_path"] },
               }
            },
         },
      );

      const result = order.map(async (orderItem) => {
         orderItem.images = await ItemsImages.findAll({
            where: { item_id: orderItem.ItemsDetails.item_id },
            attributes: { exclude: ["id", item_id] }
         });
         return orderItem;
      });

      const orderItems = await Promise.all(result);

      return res.status.json(orderItems);
   } catch (e) {
      return next(e);
   }
};
