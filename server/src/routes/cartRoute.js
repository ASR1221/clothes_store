const cartController = require("../controllers/cartController");
const session = require("../middlewares/Session");

const router = require("express").Router();

//* check session before any operation below
router.post("/add", session.checkAndRecreateSession, cartController.addToCart);

router.post("/update", session.checkAndRecreateSession, cartController.updateCartItem);

router.delete("/remove/:id", session.checkAndRecreateSession, cartController.removeFromCart);