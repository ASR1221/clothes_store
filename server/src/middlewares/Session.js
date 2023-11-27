if (process.env.NODE_ENV !== "production") {
   require("dotenv").config();
}
const jwt = require("jsonwebtoken");

exports.createSession = (req, res, next) => {

   const { id, name, email, phone_number, cartItemsCount } = req.user;
   
   const expiresIn = req.path.includes("native") ? "7d" : "15m";
   jwt.sign(
      {
         id,
      },
      process.env.LOGIN_JWT_SESSION_SECRET,
      {
         expiresIn,
      },
      (err, token) => {
         if (err) {
            return next(err);
         }

         return res.status(200).json({
            sessionToken: token,
            name,
            email: email ? email : null,
            phone_number: phone_number ? phone_number : null,
            cartItemsCount,
         });
      });
}

exports.checkAndRecreateSession = (req, res, next) => {

   if (!req.headers.authorization) {
      const error = new Error("No session token. Please try logging in")
      error.status = 401;
      return next(error);
   }

   const sessionToken = req.headers.authorization.split("Bearer ")[1];
   if (!sessionToken) {
      const error = new Error("No session token. Please try logging in")
      error.status = 401;
      return next(error);
   }

   jwt.verify(sessionToken, process.env.LOGIN_JWT_SESSION_SECRET, (err, data) => {
      
      if (err) {
         const error = new Error("Unauthorized. sessionToken has either expired or altered.")
         error.status = 401;
         return next(error)
      }

      const expiresIn = req.path.includes("native") ? "7d" : "15m";
      jwt.sign(
         {
            id: data.id,
         },
         process.env.LOGIN_JWT_SESSION_SECRET,
         {
            expiresIn,
         },
         (error, token) => {
            if (error) {
               return next(error);
            }

            req.user = {
               user_id: data.id,
               sessionToken: token,
            }
            return next();
         });
   });
}

