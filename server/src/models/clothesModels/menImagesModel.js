const { DataTypes } = require("sequelize");
const sequelize = require("../../utils/database");
const Men = require("./menModel");

const MenImages = sequelize.define("menImages", {
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
   tableName: "menImages",
});

MenImages.belongsTo(Men, {
   foreignKey: {
      name: "product_id",
      type: DataTypes.BIGINT,
      allowNull: false,
   }
});

module.exports = MenImages;