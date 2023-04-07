const { DataTypes } = require("sequelize");
const sequelize = require("../../utils/database");

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
   product_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
         model: "kids",
         key: "id",
      },
   },
}, {
   tableName: "kidsImages",
});

module.exports = KidsImages;