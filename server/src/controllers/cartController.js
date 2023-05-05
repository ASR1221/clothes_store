const Cart = require("../models/userModels/cartModel");
const Items = require("../models/clothesModels/itemsModel");
const ItemsDetails = require("../models/clothesModels/itemsDetailsModel");
const { Op } = require("sequelize");

exports.addToCart = async (req, res, next) => {
   const { item_details_id, item_count } = req.body;
   const { user_id, sessionToken } = req.user;

   if (!(item_details_id && (item_count && item_count > 0))) {
      const error = new Error("Missing Information. Please try again.")
      error.status = 400;
      return next(error);
   }

   try {
      const item = await ItemsDetails.findOne({
         where: {
            id: item_details_id,
            stock: { [Op.gt]: 0 },
         },
         include: {
            model: Items,
            attributes: ["price"],
         }
      });

      const total_price = parseFloat(item.item.price) * item_count;
      await Cart.create({ user_id, item_details_id, item_count, total_price});
      return res.status(200).json({
         sessionToken,
         message: "cart item added"
      });

   } catch (e) {
      return next(e);
   }
}

exports.listCartItems = async (req, res, next) => {
   const { user_id } = req.user;

   try {
      const cartItems = await Cart.findAll({
         where: { user_id },
         attributes: { exclude: ["user_id", "createdAt", "updatedAt", "item_details_id"] },
         include: {
            model: ItemsDetails,
            attributes: { exclude: ["updatedAt", "createdAt", "item_id"] },
            include: {
               model: Items,
               attributes: { exclude: ["image_path", "available", "createdAt", "updatedAt"] },
            },
         }
      });

      return res.status(200).json(cartItems);

   } catch (e) {
      return next(e);
   }
}

exports.updateCartItem = async (req, res, next) => {
   const { id, item_details_id, item_count } = req.body;

   if (!(id && item_details_id && (item_count && item_count > 0))) {
      const error = new Error("Missing Information. Please try again.")
      error.status = 400;
      return next(error);
   }

   try {

      const item = await ItemsDetails.findByPk(item_details_id,
         {
            attributes: ["stock"],
            include: [{
               model: Items,
               attributes: ["price", "available"],
            }],
         });
      
      if (item_count > item.stock) {
         const error = new Error("Sorry, we don't have this amount of the item.")
         error.status = 400;
         return next(error);
      }

      const total_price = parseFloat(item.item.price) * item_count;

      const newCartItem = await Cart.update(
         { 
            item_details_id,
            item_count,
            total_price,
         },
         {
            where: { id },
         }
      );

      if (!newCartItem[0] > 0) {
         const error = new Error("Sorry, we could not find this cart item.")
         error.status = 404;
         return next(error);
      }
      
      return res.status(200).json({
         message: "updated successfully",
         sessionToken: req.user.sessionToken,
      });
      
   } catch (e) {
      return next(e)
   }
}

exports.removeFromCart = async (req, res, next) => {
   try {
      const result = await Cart.destroy({ where: { id: req.params.id } })
      if (!result) { 
         const error = new Error("Item not found.");
         error.status = 404;
         return next(error);
      }
      
      return res.status(200).json({
         message: "Cart item deleted",
         sessionToken: req.user.sessionToken,
      });
      
   } catch (e) {
      return next(e);
   }
}