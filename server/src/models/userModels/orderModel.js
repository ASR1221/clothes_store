const { DataTypes } = require("sequelize");
const sequelize = require("../../utils/database");

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
   customer_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
         model: "users",
         key: "id",
      },
   },
   product_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
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