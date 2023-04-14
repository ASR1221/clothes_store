const ItemsImages = require("../models/clothesModels/imagesModel");
const ItemsDetails = require("../models/clothesModels/itemsDetailsModel");
const Items = require("../models/clothesModels/itemsModel");

exports.list = async (req, res, next) => {
   const { section, type } = req.query;

   if (!section) {
      const error = new Error("No section specified");
      error.status = 400;
      return next(error);
   }

   try {
      let items;
      if (type) {
         items = await Items.findAll({
            where: { section, type, available: true },
            attributes: { exclude: ["section", "available"] },
         });
      } else {
         items = await Items.findAll({
            where: { section, available: true  },
            attributes: { exclude: ["section", "available"] },
         });
      }
   
      return res.status(200).json(items);

   } catch (e) {
      return next(e);
   }
};

exports.itemsDetails = async (req, res, next) => {
   const { id } = req.params;

   if (!id) {
      const error = new Error("No item specified");
      error.status = 400;
      return next(error);
   }

   try {
      const itemInctances = await ItemsDetails.findAll({
         where: { item_id: id },
      });
      
      const images = await ItemsImages.findAll({
         where: { item_id: id },
      });

      const itemDetails = itemInctances.map(itemInctance =>{
         if (itemInctance.stock) {
            return {
               stock: itemInctance.stock,
               size: itemInctance.size,
               color: itemInctance.color,
               id: itemInctance.id,
            };
         }
      });

      return res.status(200).json({
         itemDetails,
         images,
      });

   } catch (e) {
      return next(e);
   }
};