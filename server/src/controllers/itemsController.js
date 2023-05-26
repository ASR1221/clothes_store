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
      const exclude = ["section", "available", "createdAt", "updatedAt"];
      const whereClause = {
         section,
         available: true,
      }

      if (type) {
         whereClause.type = type;
      }

      const items = await Items.findAll({
         where: whereClause,
         attributes: { exclude },
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
      const itemInctances = await ItemsDetails.findAll({
         where: {
            item_id: id,
            stock: { [Op.gt]: 0 },
         },
         attributes: { exclude: ["createdAt", "updatedAt"] }
      });
      
      const images = await ItemsImages.findAll({
         where: { item_id: id },
         attributes: ["path"],
      });

      const itemsDetail = itemInctances.map(itemInctance =>{
         if (itemInctance.stock > 0) {
            return {
               stock: itemInctance.stock,
               size: itemInctance.size,
               color: itemInctance.color,
               id: itemInctance.id,
            };
         }
      });

      return res.status(200).json({
         itemsDetail,
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
      

      const relevanceItems = results.map(item => ({
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