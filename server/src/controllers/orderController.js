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
      const error = new Error("Did not get all information needed. Please try again.")
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
      cartItems.map((item) => (order_price += item.total_price));

      const order = await Order.create({
         payment_method,
         credit_card: credit_card ? credit_card : null,
         order_price,
         user_id,
      });

      cartItems.map((item) => (item.order_id = order.id));
      const OrderItem = await OrderItems.bulkCreate(cartItems);

      return res.status(200).json({ message: "Order made successfully", sessionToken });
   } catch (e) {
      return next(e);
   }
};

exports.getOrder = async (req, res, next) => {
   const { user_id } = req.user;

   try {
      const order = await Order.findAll({ where: { user_id } });

      return res.status(200).json(order);
   } catch (e) {
      return next(e);
   }
};

exports.getOrderDetails = async (req, res, next) => {
   const { user_id } = req.user;
   const { order_id } = req.body;

   if (!order_id) {
      const error = new Error("Did not get all information needed. Please try again.")
      error.status = 400;
      return next(error);
   }

   try {
      const orderItems = await OrderItems.findAll(
         {
            where: { order_id },
            attributes: { exclude: ["order_id"] },
            include: {
               model: ItemsDetails,
               attributes: { exclude: ["stock"] },
            },
         },
      );

      orderItems.map(async (orderItem) => {
         orderItem.item = await Items.findByPk(orderItem.ItemsDetails.item_id, { attributes: { exclude: ["id"] } });
      });

      return res.status.json(orderItems);
   } catch (e) {
      return next(e);
   }
};
