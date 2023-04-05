const { Sequelize } = require("sequelize");

if (process.env.NODE_ENV !== "production") {
   require("dotenv").config();
}

// Database connection
const sequelize = new Sequelize({
   database: process.env.DATABASE_NAME,
   username: process.env.DATABASE_USER,
   password: process.env.DATABASE_PASSWORD,
   host: process.env.DATABASE_URL,
   port: process.env.DATABASE_PORT,
   dialect: "mysql",
});

// chech if connection is good //! DELETE later
sequelize.authenticate()
   .then(() => console.log('Connection has been established successfully.'))
   .catch(e => console.error('Unable to connect to the database:', e));

module.exports = sequelize;
 