const { DataTypes } = require("sequelize");
const sequelize = require("../../utils/database");

const Items = sequelize.define("items", {
   id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      unique: true,
   },
   name: {
      type: DataTypes.STRING(30),
   },
   price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
   },
   image_path: {
      type: DataTypes.STRING(50),
   },
   gender: {
      type: DataTypes.ENUM("men", "women", "kids"),
      allowNull: false,
   },
   type: {
      type: DataTypes.ENUM("jeans", "shirts", "coats", "dresses", "skirts"),
      allowNull: false,
   },
}, {
   tableName: "items",
});

module.exports = Items;