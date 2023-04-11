const { DataTypes } = require("sequelize");
const sequelize = require("../../utils/database");
const Kids = require("./kidsModel");

const KidsImages = sequelize.define("kidsImages", {
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
   tableName: "kidsImages",
});

KidsImages.belongsTo(Kids, {
   foreignKey: {
      name: "product_id",
      type: DataTypes.BIGINT,
      allowNull: false,
   }
});

module.exports = KidsImages;