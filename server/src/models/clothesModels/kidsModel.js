const { DataTypes } = require("sequelize");
const sequelize = require("../../utils/database");
const SIZES = require("../../constants/sizes");
const COLORS = require("../../constants/colors");

const KIDS = sequelize.define("kids", {
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
      type: DataTypes.STRING,
   },
   size: {
      type: DataTypes.ENUM(SIZES),
      allowNull: false,
   },
   color: {
      type: DataTypes.ENUM(COLORS),
      allowNull: false,
   },
   gender: {
      type: DataTypes.ENUM("male", "female"),
      allowNull: false,
   },
   type: {
      type: DataTypes.ENUM("jeans", "shirts", "coats", "dresses", "skirts"),
      allowNull: false,
   },
}, {
   tableName: "kids",
});

module.exports = KIDS;