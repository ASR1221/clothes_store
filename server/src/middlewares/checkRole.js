const Admins = require("../models/userModels/adminsModel");

module.exports = async (req, res, next) => {
   const { user_id } = req.user;

   try {
      const admins = await Admins.findAll({ where: { user_id } });
      
      if (admins.length < 1) {
         const error = new Error("You are not allowed to visit this route.");
         error.status = 400;
         return next(error);
      }
   
      const roles = admins.map(admin => admin.role);
      req.user.roles = roles;
   
      return next();
   } catch (e) {
      return next(e);
   }
}