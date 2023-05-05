const Users = require("../models/userModels/usersModel");
const Cart = require("../models/userModels/cartModel");
const countries = require("../constants/countries");
const { Op } = require("sequelize");

exports.googleUser = async (req, res, next) => {

   const { access_token } = req.body;

   if (!access_token) {
      const error = new Error("Missing Information. Please try again.")
      error.status = 400;
      return next(error);
   }

   try {
      const response = await fetch(`https://people.googleapis.com/v1/people/me?personFields=emailAddresses,names&access_token=${access_token}`);
      const { names, emailAddresses } = await response.json();

      const name = names[0].displayName;
      const email = emailAddresses[0].value;
      const email_verified = emailAddresses[0].metadata.verified;

      if (!(response.ok && email_verified && email && name)) {
         const error = new Error("There was a problem getting your data. Please try again.");
         error.status = 500;
         return next(error);
      }

      if (!email_verified) {
         const error = new Error("Email is not verified. Please use a verified email.");
         error.status = 401;
         return next(error);
      }

      const [user, created] = await Users.findOrCreate({
         where: { email },
         attributes: { exclude: ["createdAt", "updatedAt"]},
         defaults: {
            name,
            email,
         }
      });
      
      const cartItemsCount = created ? 0 : await Cart.count({ where: { user_id: user.id } });

      req.user = {
         id: user.id,
         name: user.name,
         email,
         cartItemsCount,
      }
      return next();

   } catch (err) {
      return next(err);
   }
}


exports.facebookUser = async (req, res, next) => {

   const { access_token } = req.body
   if (!access_token) {
      const error = new Error("Missing Information. Please try again.")
      error.status = 400;
      return next(error);
   }

   try {
      const facebookResponse = await fetch(`https://graph.facebook.com/me?fields=id,name,email&access_token=${access_token}`);
      // should add phone_number to the fields above but it requires advance permissions. and also add phone number to the scopes in the request url in the client side.
      const { name, email, phone_number } = await facebookResponse.json(); 

      if (!(response.ok && (email ||  phone_number) && name)) {
         const error = new Error("There was a problem getting your data. Please try again.");
         error.status = 500;
         return next(error);
      }
      
      const [user, created] = await Users.findOrCreate({
         where: {
            [Op.or]: {
               email: email || null, 
               phone_number: phone_number || 12,
            }
         },
         defaults: {
            name,
            email: email || null,
            phone_number: phone_number || null,
         }
      });

      const cartItemsCount = created ? 0 : await Cart.count({ where: { user_id: user.id } });

      req.user = {
         id: user.id,
         name: user.name,
         email,
         phone_number,
         cartItemsCount,
      }
      return next();

   } catch (e) {
      return next(e);
   }
}

exports.setUserInfo = (req, res, next) => {
   const { country, city, district, nearestPoI, phone_number } = req.body;

   if (!(district && nearestPoI && phone_number)) {
      const error = new Error("Missing Information. Please try again.")
      error.status = 400;
      return next(error);
   }

   if (!(phone_number.length > 10 && Number(phone_number))) {
      const error = new Error("phone_number field is not a phone number.")
      error.status = 400;
      return next(error);
   }
   
   if (!(countries.some(location => location.country === country && location.cities.includes(city)))) {
      const error = new Error("We can't reach this location yet");
      error.status = 400;
      return next(error);
   }

   Users.update({
      country,
      city,
      district,
      nearestPoI,
      phone_number,
   }, {
      where: {
         id: req.user.user_id
      }
   })
      .then(() => res.status(200).json({ message: "Location and phone number saved" }))
      .catch(e => next(e));
}

exports.getUserInfo = async (req, res, next) => {
   
   try {
      const {
         country,
         city,
         district,
         nearestPoI,
         phone_number } = await Users.findByPk(req.user.user_id,
            {
               attributes: ["country", "city", "district", "nearestPoI", "phone_number"]
            });
      
      if (!(country && city && district && nearestPoI && phone_number)) {
         const error = new Error("The user haven't specified his location and phone number yet.");
         error.status = 404;
         return next(error);
      }

      res.status(200).json({
         country,
         city,
         district,
         nearestPoI,
         phone_number,
      });
   } catch (e) {
      return next(e);
   }
}