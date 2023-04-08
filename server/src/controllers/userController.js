const jwt = require("jsonwebtoken");

const Users = require("../models/userModels/usersModel");
const Cart = require("../models/userModels/cartModel");
const { Op } = require("sequelize");

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
            [Op.and]: {
               email, 
               phone_number,
            }
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