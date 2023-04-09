const { DataTypes } = require("sequelize");
const sequelize = require("../../utils/database");
const SIZES = require("../../constants/sizes");
const COLORS = require("../../constants/colors");

const Order = sequelize.define("order", {
   id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      unique: true,
   },
   product_id: {
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
   product_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
   },
   customer_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
         model: "users",
         key: "id",
      },
   },
   totoal_price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
   },
   payment_method: {
      type: DataTypes.ENUM("credit-card", "cash"),
      allowNull: false,
   },
   credit_card: {
      type: DataTypes.STRING,
   },
}, {
   tableName: "order",
   createdAt: "order_date"
});

module.exports = Order;