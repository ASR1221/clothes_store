if (process.env.NODE_ENV !== "production") {
   require("dotenv").config();
}

module.exports = (req, res, next) => {

   const { id, name, email, phone_number, cartItems } = req.user;
   
   const expiresIn = req.path.includes("mobile") ? "7d" : "7m";
   jwt.sign(
      {
         id,
         name,
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