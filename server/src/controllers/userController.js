const Users = require("../models/userModels/usersModel");
const Cart = require("../models/userModels/cartModel");

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

