const Users = require("../models/userModels/usersModel");
const Cart = require("../models/userModels/cartModel");
const Women = require("../models/clothesModels/womenModel");
const Men = require("../models/clothesModels/menModel");
const Kids = require("../models/clothesModels/kidsModel");

exports.googleUser = async (req, res, next) => {

   if (req.body.accessToken) {
      const error = new Error("Did not get all information needed. Please try again.")
      error.status = 400;
      return next(error);
   }
   
   try {
      const response = await fetch(`https://people.googleapis.com/v1/people/me?personFields=emailAddresses(metadata),names&access_token=${req.body.accessToken}`)
      const { names, emailAddresses } = await response.json();
      
      const name = names[0].displayName;
      const email = emailAddresses[0].value;
      const email_verified = emailAddresses[0].metadata.verified;

      if (!(email_verified && email && name)) {
         const error = new Error("There was a problem getting your data. Please try again.");
         error.status = 400;
         return next(error);
      }

      if (!email_verified) {
         const error = new Error("Email is not verified. Please use a verified email.");
         error.status = 401;
         return next(error);
      }

      const [user, created] = await Users.findOrCreate({
         where: { email },
         defaults: {
            name,
            email,
         }
      });
      
      const cartItems = created ? [] : await Cart.findAll({ where: { user_id: user.id } });

      req.user = {
         id: user.id,
         name: user.name,
         email,
         cartItems,
      }
      return next();

   } catch (err) {
      return next(err);
   }
}


exports.facebookUser = async (req, res, next) => {

   if (req.body.accessToken) {
      const error = new Error("Did not get all information needed. Please try again.")
      error.status = 400;
      return next(error);
   }

   try {
      const facebookResponse = await fetch(`https://graph.facebook.com/me?fields=id,name,email,phone_number&access_token=${req.body.accessToken}`);
      const { name, email, phone_number } = facebookResponse.json();
      
      email = email ? email : null;
      phone_number = phone_number ? phone_number : null;

      if (!((email || phone_number) && name)) {
         const error = new Error("There was a problem getting your data. Please try again.");
         error.status = 400;
         return next(error);
      }
      
      const [user, created] = await Users.findOrCreate({
         where: {
            email, 
            phone_number,
         },
         defaults: {
            name,
            email,
            phone_number,
         }
      });

      const cartItems = created ? [] : await Cart.findAll({ where: { user_id: user.id } });

      req.user = {
         id: user.id,
         name: user.name,
         email,
         phone_number,
         cartItems,
      }
      return next();

   } catch (e) {
      return next(e);
   }
}


exports.addToCart = async (req, res, next) => {
   const { user_id, item_id, item_size, item_color, item_table, count } = req.body;
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
      return res.status(200).json(newCartItem);

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

      return res.status(200).json(newCartItem);
   } catch (e) {
      return next(e)
   }
}

exports.removeFromCart = async (req, res, next) => {
   try {
      const result = await Cart.destroy({ where: { id: req.body.id } })
      if (result) return res.status(200).json({ message: "Cart item deleted" });
   } catch (e) {
      return next(e);
   }
}
