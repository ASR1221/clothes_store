const { DataTypes } = require("sequelize");
const sequelize = require("../../utils/database");
const SIZES = require("../../constants/sizes");
const COLORS = require("../../constants/colors");
const Items = require("./itemsModel");

const ItemsDetails = sequelize.define("itemsDetails", {
   id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      unique: true,
   },
   size: {
      type: DataTypes.ENUM(SIZES),
      allowNull: false,
   },
   color: {
      type: DataTypes.ENUM(COLORS),
      allowNull: false,
   },
   stock: {
      type: DataTypes.SMALLINT,
      allowNull: false,
   }
}, {
   tableName: "itemsDetails",
});

ItemsDetails.belongsTo(Items, {
   foreignKey: {
      name: "item_details_id",
      type: DataTypes.BIGINT,
      allowNull: false,
   }
});

module.exports = ItemsDetails;