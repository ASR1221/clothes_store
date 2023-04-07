const { DataTypes } = require("sequelize");
const sequelize = require("../../utils/database");

const WomenImages = sequelize.define("womenImages", {
   id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      unique: true,
   },
   path: {
      type: DataTypes.STRING(50),
      allowNull: false,
   },
   product_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
         model: "women",
         key: "id",
      },
   },
}, {
   tableName: "womenImages",
});

module.exports = WomenImages;