const { DataTypes } = require("sequelize");
const sequelize = require("../../utils/database");
const SIZES = require("../../constants/sizes");
const COLORS = require("../../constants/colors");
const Users = require("./usersModel");
const ItemsDetails = require("../clothesModels/itemsDetailsModel");

const Cart = sequelize.define("cart", {
   id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
   },
   item_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
   },
   total_price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
   },
}, {
   tableName: "cart",
});

Cart.belongsTo(Users, {
   foreignKey: {
      name: "user_id",
      type: DataTypes.UUID,
      allowNull: false,
   }
});

Cart.belongsTo(ItemsDetails, {
   foreignKey: {
      name: "item_details_id",
      type: DataTypes.BIGINT,
      allowNull: false,
   }
})

module.exports = Cart;