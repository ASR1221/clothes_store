const express = require("express");
const helmet = require("helmet");
const compression = require("express-compression");
const sequelize = require("./utils/database");

// TODO: create to seperate path for mobile and web
// TODO: payment

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

// database sync (should import model to work) //! DELETE after sync is complete
// sequelize.sync({ force: true})
//    .then(() => console.log("database syncd"))
//    .catch(e => console.log(`database sync error: ${e}`));

// routes
app.use("/api/mobile", require("./routes/mainRoute"));
app.use("/api", require("./routes/mainRoute"));

// Handling 404 (Not found)
app.use((req, res, next) => {
   const err = new Error("Not Found!");
   err.status = 404;
   next(err);
});

// Error handler
app.use((err, req, res, next) => res.status(err.status || 500).json({ message: err.message }));

app.listen(process.env.PORT || 3000);