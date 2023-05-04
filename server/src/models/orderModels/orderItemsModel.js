const { DataTypes } = require("sequelize");
const sequelize = require("../../utils/database");
const SIZES = require("../../constants/sizes");
const COLORS = require("../../constants/colors");
const Order = require("./orderModel");
const ItemsDetails = require("../clothesModels/itemsDetailsModel");

const OrderItems = sequelize.define(
   "orderItems",
   {
      id: {
         type: DataTypes.UUID,
         primaryKey: true,
         defaultValue: DataTypes.UUIDV4,
         allowNull: false,
         unique: true,
      },
      item_count: {
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      total_price: {
         type: DataTypes.DECIMAL(10,2),
         allowNull: false,
      },
   },
   {
      tableName: "orderItems",
   }
);

OrderItems.belongsTo(Order, {
   foreignKey: {
      name: "order_id",
      type: DataTypes.BIGINT,
      allowNull: false,
   },
});

OrderItems.belongsTo(ItemsDetails, {
   foreignKey: {
      name: "item_details_id",
      type: DataTypes.BIGINT,
      allowNull: false,
   },
});

module.exports = OrderItems;
