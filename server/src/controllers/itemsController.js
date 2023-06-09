const { Op } = require("sequelize");
const ItemsImages = require("../models/clothesModels/imagesModel");
const ItemsDetails = require("../models/clothesModels/itemsDetailsModel");
const Items = require("../models/clothesModels/itemsModel");

exports.list = async (req, res, next) => {
   const { section, type, page } = req.query;

   if (!section) {
      const error = new Error("No section specified");
      error.status = 400;
      return next(error);
   }

   try {
      const whereClause = {
         section,
         available: true,
      }

      if (type) {
         whereClause.type = type;
      }

      const items = await Items.findAll({
         where: whereClause,
         attributes: { exclude: ["section", "available", "createdAt", "updatedAt"] },
         limit: 12,
         offset: (Number(page) - 1) * 12,
      });

      const result = {
         nextCursor: Number(page) + 1,
         items,
      };
      if (items.length < 12) result.nextCursor = null;
   
      return res.status(200).json(result);

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
      
      const item = await Items.findOne({
         where: { id, available: true },
         attributes: ["name", "price", "section", "type"],
      });

      if (item.length < 1) {
         const error = new Error("Item is not available.");
         error.status = 404;
         return next(error);
      }
      
      const itemDetails = await ItemsDetails.findAll({
         where: {
            item_id: id,
            stock: { [Op.gt]: 0 },
         },
         attributes: { exclude: ["createdAt", "updatedAt"] },
      });

      if (itemDetails.length < 1) {
         const error = new Error("Item is out of stock.");
         error.status = 404;
         return next(error);
      }
      
      const imagesRes = await ItemsImages.findAll({
         where: { item_id: id },
         attributes: ["path"],
      });

      const images = imagesRes.map(img => img.path);

      return res.status(200).json({
         item,
         itemDetails,
         images,
      });

   } catch (e) {
      return next(e);
   }
};

exports.searchItem = async (req, res, next) => {
   const { term, page } = req.query;

   if (!term) {
      const error = new Error("Missing Information. You have to specify 'term' of the search.");
      error.status = 400;
      return next(error);
   }

   const terms = term.split(" ");
   const searchQuery = terms.map(word => ({
      [Op.or]: [
         {
            name: { [Op.like]: `%${word}%` },
         },
         {
            section: { [Op.like]: `%${word}%` },
         },
         {
            type: { [Op.like]: `%${word}%` },
         },
      ]
   }));

   try {
      const results = await Items.findAll({
         where: {
            [Op.and]: searchQuery,
            available: true,
         },
         attributes: { exclude: ["available", "createdAt", "updatedAt"] },
         limit: 12,
         offset: (Number(page) - 1) * 12,
      });
      
      console.log(/\bmen\b/i.test(term))
      const fResult = results.filter(item => {
         if (/\bmen\b/i.test(term)) {
            if (item.section === "men") {
               return true;
            } 
            return false;
         } 
         return true;
      });

      const relevanceItems = fResult.map(item => ({
         item,
         score: terms.reduce((score, word) => score + (
            item.name.match(new RegExp(word, "gi")) ||
            item.section.match(new RegExp(word, "gi")) ||
            item.type.match(new RegExp(word, "gi"))
         )?.length || 0, 0)
      }));

      const sortedItems = relevanceItems.sort((a, b) => b.score - a.score);
      const items = sortedItems.map((item) => { 
         const newItem = item.item;
         return newItem;
      });

      const result = {
         nextCursor: Number(page) + 1,
         items,
      };
      if (items.length < 12) result.nextCursor = null;

      res.status(200).json(result);

   } catch (e) {
      return next(e);
   }
}