const ItemsDetails = require("../models/clothesModels/itemsDetailsModel");
const Items = require("../models/clothesModels/itemsModel");
const OrderItems = require("../models/orderModels/orderItemsModel");
const Order = require("../models/orderModels/orderModel");
const Admins = require("../models/userModels/adminsModel");
const Users = require("../models/userModels/usersModel");


exports.allowAccess = async (req, res, next) => {
   const { sessionToken, roles } = req.user;

   return res.status(200).json({
      roles,
      sessionToken,
   });
};

// check role before every route 
exports.listServedItems = async (req, res, next) => {
   const { user_id, sessionToken, roles } = req.user;
   const { from, to, section, type } = req.query;

   if (!roles.includes("order")) {
      const error = new Error("You are not allowed to visit this route.");
      error.status = 400;
      return next(error);
   }

   // TODO: complete request
};

exports.listPendingItems = async (req, res, next) => {
   const { user_id, sessionToken, roles } = req.user;
   const { country, city } = req.query;

   if (!roles.includes("order")) {
      const error = new Error("You are not allowed to visit this route.");
      error.status = 400;
      return next(error);
   }

   if (!(country && city)) {
      const error = new Error("You have to specify the country and the city");
      error.status = 400;
      return next(error);
   }

   try {
      const orders = await Order.findAll({
         where: { served: false },
         attributes: { exclude: ["served"] },
         include: {
            model: Users,
            attributes: { exclude: ["id"] },
         },
      });
   
      const result = orders.map(async (order) => {
         if (order.Users.country !== country || order.User.city !== city) {
            return;
         }
         const orderItems = await OrderItems.findAll({
            where: { order_id: order.id },
            attributes: { exclude: ["id"] },
            include: {
               model: ItemsDetails,
               attributes: { exclude: ["stock"] },
               include: {
                  model: Items,
                  attributes: { exclude: ["image_path", "available"] },
               }
            }
         });
         order.orderItems = orderItems;
         return order;
      });

      const allOrders = await Promise.all(result);
      
      return res.status(200).json({
         sessionToken,
         allOrders,
      });

   } catch (e) {
      return next(e);
   }
};

exports.addNewItem = async (req, res, next) => {
   const { user_id, sessionToken, roles } = req.user;

   // TODO: complete request
};