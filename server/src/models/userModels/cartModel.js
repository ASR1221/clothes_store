const { DataTypes } = require("sequelize");
const sequelize = require("../../utils/database");
const SIZES = require("../../constants/sizes");
const COLORS = require("../../constants/colors");

const Cart = sequelize.define("cart", {
   id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
   },
   item_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
   },
   item_table: {
      type: DataTypes.ENUM("women", "men", "kids"),
      allowNull: false,
   },
   item_size: {
      type: DataTypes.ENUM(SIZES),
      allowNull: false,
   },
   item_color: {
      type: DataTypes.ENUM(COLORS),
      allowNull: false,
   },
   item_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
   },
   totoal_price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
   },
   user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
         model: "users",
         key: "id",
      },
   },
}, {
   tableName: "cart",
});

module.exports = Cart;