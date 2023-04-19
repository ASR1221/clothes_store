if (process.env.NODE_ENV !== "production") {
   require("dotenv").config();
}
const jwt = require("jsonwebtoken");

exports.createSession = (req, res, next) => {

   const { id, name, email, phone_number, cartItems } = req.user;
   
   const expiresIn = req.path.includes("native") ? "7d" : "7m";
   jwt.sign(
      {
         user_id,
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
            cartItems,
         });
      });
}

exports.checkAndRecreateSession = (req, res, next) => {
   const { sessionToken } = req.body;
   if (sessionToken) {
      const error = new Error("No session token. Please try logging in")
      error.status = 401;
      return next(error);
   };

   jwt.verify(sessionToken, process.env.LOGIN_JWT_SESSION_SECRET, (err, data) => {
      if (err) return next(err);

      const expiresIn = req.path.includes("native") ? "7d" : "7m";
      jwt.sign(
         {
            user_id: data.user_id,
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
               user_id: data.user_id,
               sessionToken: token,
            }
         });
   });
}

