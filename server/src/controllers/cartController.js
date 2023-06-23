const Cart = require("../models/userModels/cartModel");
const Items = require("../models/clothesModels/itemsModel");
const ItemsDetails = require("../models/clothesModels/itemsDetailsModel");
const { Op } = require("sequelize");

exports.addToCart = async (req, res, next) => {
   const items = req.body;
   const { user_id, sessionToken } = req.user;

   try {

      if (!items.length) {
         throw new Error("No Items in the body");
      }

      items.forEach(item => {
         if (!(item.item_details_id && item.item_count)) {
            throw new Error("Missing Information. Please try again.");
         }
         if (item.item_count < 1) {
            throw new Error("item_count for all items has to be bigger than 0.");
         }
      });

   } catch (e) {
      return next(e);
   }

   try {
      const promises = [];
      items.forEach(item => {
         
         const reply = ItemsDetails.findOne({
            where: {
               id: item.item_details_id,
               stock: { [Op.gt]: 0 },
            },
            include: {
               model: Items,
               attributes: ["price"],
            }
         });
         promises.push(reply);
      });

      const pricesArr = await Promise.all(promises);

      if (pricesArr.length < 1) throw new Error("The specified item_count is larger than what is available of the item.");
      console.log(pricesArr)
      const cartItems = pricesArr.map(priceObj => {
         let total_price = 0;
         let item_count = 0;
         items.forEach(item => {
            if (item.item_details_id === priceObj.id) {
               total_price = parseFloat(priceObj.item.price) * item.item_count;
               item_count = item.item_count;
            }
         });
         if (!total_price) return;

         return {
            user_id,
            item_details_id: priceObj.id,
            item_count,
            total_price,
         };
      });

      await Cart.bulkCreate(cartItems);
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
               attributes: { exclude: ["section", "type", "available", "createdAt", "updatedAt"] },
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