const { DataTypes } = require("sequelize");
const sequelize = require("../../utils/database");
const SIZES = require("../../constants/sizes");
const COLORS = require("../../constants/colors");
const Cart = require("./cartModel");

const Order = sequelize.define("order", {
   id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      unique: true,
   },
   payment_method: {
      type: DataTypes.ENUM("credit-card", "cash"),
      allowNull: false,
   },
   credit_card: {
      type: DataTypes.STRING,
   },
   served: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
   }
}, {
   tableName: "order",
   createdAt: "order_date"
});

Cart.hasOne(Order, {
   foreignKey: {
      name: "cart_item",
      type: DataTypes.UUID,
      allowNull: false,
   }
});

module.exports = Order;