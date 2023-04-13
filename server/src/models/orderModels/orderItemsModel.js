const { DataTypes } = require("sequelize");
const sequelize = require("../../utils/database");
const SIZES = require("../../constants/sizes");
const COLORS = require("../../constants/colors");
const Order = require("./orderModel");

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
      item_id: {
         type: DataTypes.BIGINT,
         allowNull: false,
      },
      item_table: {
         type: DataTypes.ENUM("women", "men", "kids"),
         allowNull: false,
      },
      item_size: {
         type: DataTypes.ENUM(SIZES),
         allowNull: false,
      },
      item_color: {
         type: DataTypes.ENUM(COLORS),
         allowNull: false,
      },
      item_count: {
         type: DataTypes.INTEGER,
         allowNull: false,
      },
      totoal_price: {
         type: DataTypes.DECIMAL,
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

module.exports = OrderItems;
