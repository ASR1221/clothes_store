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
      });

      if (!cartItems.length > 0) {
         const error = new Error("No cart item founded. Put some items in youe cart before making an order.");
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

      let order_price = 0;
      cartItems.forEach((item) => (order_price += item.total_price));

      const order = await Order.create({
         payment_method,
         credit_card: credit_card ? credit_card : null,
         order_price,
         user_id,
      });

      const items = cartItems.map((item) => {
         item = { ...item.dataValues };
         item.order_id = order.id;
         return item;
      });
      const orderItems = await OrderItems.bulkCreate(items);

      res.status(200).json({ message: "Order made successfully", sessionToken });

      // run a check to see if more items are available and update accordinglly
      async function onFinish() {
         try {
            let item_id;
            await Promise.all(
               items.map(async (item) => {
                  const itemsDetails = await ItemsDetails.findByPk(item.item_details_id, {
                     attributes: ["stock", "id"],
                     include: {
                        model: Items,
                        attributes: ["id"],
                     },
                  });
                  item_id = itemsDetails.item.id;
                  return itemsDetails.decrement("stock", { by: item.item_count }); 
               })
            );
            
            const alltems = await ItemsDetails.findAll({
               where: { item_id },
               attributes: ["stock"],
            });

            const available = alltems.some((item) => item.stock > 0);
            if (!available) {
               await Items.update({ available }, { where: { id: item_id } });
            }
                        
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
