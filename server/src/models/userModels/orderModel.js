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
   cart_item: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
         model: "cart",
         key: "id",
      },
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