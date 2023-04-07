const jwt = require("jsonwebtoken");

const Users = require("../models/userModels/usersModel");
const Cart = require("../models/userModels/cartModel");

exports.googleUser = async (req, res, next) => {
   const { email_verified, email, name } = jwt.decode(req.boy.code);

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

   try {
      const [user, created] = await Users.findOrCreate({
         where: { email },
         defaults: {
            name,
            email,
         }
      });
      if (created) {
         return res.status(200).json({
            name,
            email,
            cartItems: [],
         });
      }
      
      const cartItems = await Cart.findAll({ where: { user_id: user.id } });
      return res.status(200).json({
         name: user.name,
         email,
         cartItems,
      })

   } catch (err) {
      return next(err);
   }
}

exports.facebookUser = async (req, res, next) => {

}

exports.logout = (req, res, next) => {
   
}