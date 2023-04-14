const { DataTypes } = require("sequelize");
const sequelize = require("../../utils/database");
const Users = require("./usersModel");

const Admins = sequelize.define("admins", {
   id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
   },
   role: {
      type: DataTypes.ENUM("uploading", "finance"),
      allowNull: false,
   }
}, {
   tableName: "admins",
});

Admins.belongsTo(Users, {
   foreignKey: {
      name: "user_id",
      allowNull: false,
      type: DataTypes.UUID,
   }
})

module.exports = Admins;