const { Sequelize } = require("sequelize");

if (process.env.NODE_ENV !== "production") {
   require("dotenv").config();
}

// Database connection
const sequelize = new Sequelize({
   database: process.env.SUPABASE_DATABASE,
   username: process.env.SUPABASE_USER,
   password: process.env.SUPABASE_PASSWORD,
   host: process.env.SUPABASE_HOST,
   port: process.env.SUPABASE_PORT,
   dialect: "postgres",
});

// chech if connection is good //! DELETE later
sequelize.authenticate()
   .then(() => console.log('Connection has been established successfully.'))
   .catch(e => console.error('Unable to connect to the database:', e));

module.exports = sequelize;
 