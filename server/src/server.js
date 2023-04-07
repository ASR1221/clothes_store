const express = require("express");
const helmet = require("helmet");
const compression = require("express-compression");
const sequelize = require("./utils/database");

// TODO: may need to make a cart and favorait tables

const app = express();

// Development imports
if (process.env.NODE_ENV !== "production") {
   require("dotenv").config();
   const logger = require("morgan");
   app.use(logger("dev"));
}

// Important middlewares
app.use(helmet());
app.use(helmet.hidePoweredBy());
app.use(compression());
app.use(express.json());

// database sync (should import all models to work) //! DELETE after sync is complete
// sequelize.sync()
//    .then(() => console.log("database syncd"))  
//    .catch(e => console.log(`database sync error: ${e}`));  

// Handling 404 (Not found)
app.use((req, res, next) => {
   const err = new Error("Not Found!");
   err.status = 404;
   next(err);
});

// Error handler
app.use((err, req, res, next) => res.status(err.status || 500).json({ message: err.message }));

app.listen(process.env.PORT || 3000);