const Cart = require("../models/userModels/cartModel");
const Women = require("../models/clothesModels/womenModel");
const Men = require("../models/clothesModels/menModel");
const Kids = require("../models/clothesModels/kidsModel");

exports.addToCart = async (req, res, next) => {
   const { item_id, item_size, item_color, item_table, count } = req.body;
   const user_id = req.user.user_id;
   if (!(user_id && item_id && item_size && item_color && item_table && count)) {
      const error = new Error("Did not get all information needed. Please try again.")
      error.status = 400;
      return next(error);
   }

   try {

      let totoal_price;
      if (item_table === "women") {
         const price = await Women.findOne({ where: { id: item_id }, attributes: "price" });
         totoal_price = price.price * count;
      }
   
      if (item_table === "men") {
         const price = await Men.findOne({ where: { id: item_id }, attributes: "price" });
         totoal_price = price.price * count;
      }

      if (item_table === "kids") {
         const price = await Kids.findOne({ where: { id: item_id }, attributes: "price" });
         totoal_price = price.price * count;
      }

      const newCartItem = await Cart.create({ user_id, item_id, item_size, item_color, item_table, count, totoal_price});
      return res.status(200).json({
         ...newCartItem,
         sessionToken: req.user.sessionToken,
      });

   } catch (e) {
      return next(e);
   }
}

exports.updateCartItem = async (req, res, next) => {
   const { id, item_size, item_color, count } = req.body;

   if (!(id && item_size && item_color && count)) {
      const error = new Error("Did not get all information needed. Please try again.")
      error.status = 400;
      return next(error);
   }

   try {

      const cartItem = await Cart.findByPk(id, { attributes: ["item_id", "item_table"] });

      if (!cartItem) {
         const error = new Error("This cart item does not exist");
         error.status = 400;
         return next(error);
      }

      if (cartItem.item_table === "women") {
         const price = await Women.findOne({ where: { id: item_id }, attributes: "price" });
         cartItem.totoal_price = price.price * count;
      }
   
      if (cartItem.item_table === "men") {
         const price = await Men.findOne({ where: { id: item_id }, attributes: "price" });
         cartItem.totoal_price = price.price * count;
      }

      if (cartItem.item_table === "kids") {
         const price = await Kids.findOne({ where: { id: item_id }, attributes: "price" });
         cartItem.totoal_price = price.price * count;
      }

      cartItem.item_size = item_size;
      cartItem.item_color = item_color;
      cartItem.count = count;

      const newCartItem = await cartItem.save();

      return res.status(200).json({
         ...newCartItem,
         sessionToken: req.user.sessionToken,
      });
   } catch (e) {
      return next(e)
   }
}

exports.removeFromCart = async (req, res, next) => {
   try {
      const result = await Cart.destroy({ where: { id: req.params.id } })
      if (result) return res.status(200).json({
         message: "Cart item deleted",
         sessionToken: req.user.sessionToken,
      });
   } catch (e) {
      return next(e);
   }
}