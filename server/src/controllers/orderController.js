const OrderItems = require("../models/orderModels/orderItemsModel");
const Order = require("../models/orderModels/orderModel");
const Cart = require("../models/userModels/cartModel");
const Users = require("../models/userModels/usersModel");

exports.makeOrder = async (req, res, next) => {
   const { user_id } = req.user;
   const { payment_method, credit_card } = req.body;

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
         const error = new Error("User info are not complete. Male sure to submit all information needed");
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

      res.status(200).json(order);
   } catch (e) {
      return next(e);
   }
};

exports.getOrder = async (req, res, next) => {
   const { user_id } = req.user;

   try {
      const order = await Order.findAll({ where: { user_id, served: false } });

      res.status(200).json(order);
   } catch (e) {
      return next(e);
   }
};
