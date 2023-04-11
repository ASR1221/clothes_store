const Users = require("../models/userModels/usersModel");
const Cart = require("../models/userModels/cartModel");
const countries = require("../constants/countries");

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

exports.setUserInfo = (req, res, next) => {
   const { country, city, district, nearestPoI, phone_number } = req.body;

   if (district && nearestPoI && phone_number) {
      const error = new Error("Did not get all information needed. Please try again.")
      error.status = 400;
      return next(error);
   }
   
   if (!(countries.map(location => location.country === country && location.cities.includes(city)))) {
      const error = new Error("We can't reach this location yet");
      error.status = 400;
      return next(error);
   }

   Users.update({
      address: `${country}, ${city}, ${district}, ${nearestPoI}`,
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
      const userdata = await Users.findByPk(req.user.user_id, { attributes: ["address", "phone_number"] });
      if (userdata.address && userdata.phone_number) {
         const error = new Error("User Info are empty");
         error.status = 500;
         return next(error);
      }

      const location = userdata.address.split(", ");
      res.status.json({
         country: location[0],
         city: location[1],
         district: location[2],
         nearestPoI: location[3],
         phone_number: userdata.phone_number,
      });
   } catch (e) {
      return next(e);
   }
}