const { DataTypes } = require("sequelize");
const sequelize = require("../../utils/database");
const Women = require("./womenModel");

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
}, {
   tableName: "womenImages",
});

WomenImages.belongsTo(Women, {
   foreignKey: {
      name: "product_id",
      type: DataTypes.BIGINT,
      allowNull: false,
   }
});

module.exports = WomenImages;