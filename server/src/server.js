const express = require("express");
const helmet = require("helmet");
const compression = require("express-compression");
const sequelize = require("./utils/database");
const Item = require("./models/clothesModels/itemsModel");
const Item2 = require("./models/clothesModels/itemsDetailsModel");
const Item3 = require("./models/clothesModels/imagesModel");
const Item4 = require("./models/orderModels/orderModel");
const Item5 = require("./models/orderModels/orderItemsModel");
const Item6 = require("./models/userModels/usersModel");
const Item7 = require("./models/userModels/cartModel");
const Item8 = require("./models/userModels/adminsModel");

const app = express();

// Development imports
if (process.env.NODE_ENV !== "production") {
   require("dotenv").config();
   const logger = require("morgan");
   app.use(logger("dev"));
}
console.log(process.env.NODE_ENV);

// Important middlewares
app.use(helmet());
app.use(helmet.hidePoweredBy());
app.use(compression());
app.use(express.json());
app.use(express.static("public"));

// database sync (should import model to work) //! DELETE after sync is complete
sequelize.sync({ alter: true})
   .then(() => console.log("database syncd"))
   .catch(e => console.log(`database sync error: ${e}`));

// routes
app.use("/api/native", require("./routes/mainRoute"));
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