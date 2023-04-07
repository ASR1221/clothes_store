const { DataTypes } = require("sequelize");
const sequelize = require("../../utils/database");
const SIZES = require("../../constants/sizes");
const COLORS = require("../../constants/colors");

const MEN = sequelize.define("men", {
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
   type: {
      type: DataTypes.ENUM("jeans", "shirts", "coats"),
      allowNull: false,
   },
}, {
   tableName: "men",
});

module.exports = MEN;