const { DataTypes } = require("sequelize");
const sequelize = require("../../util/database");

const Users = sequelize.define("users", {
   id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
   },
   name: {
      type: DataTypes.STRING(30),
      allowNull: false,
   },
   email: {
      type: DataTypes.STRING(50),
      unique: true,
   },
   password: {
      type: DataTypes.STRING,
   },
   phone: {
      type: DataTypes.STRING(20),
      unique: true,
   },
   address: {
      type: DataTypes.STRING,
   },
}, {
   tableName: "users",
});

module.exports = Users;