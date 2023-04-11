const cartController = require("../controllers/cartController");
const session = require("../middlewares/Session");

const router = require("express").Router();

//* check session before any operation below
router.post("/cart/add", session.checkAndRecreateSession, cartController.addToCart);

router.post("/cart/update", session.checkAndRecreateSession, cartController.updateCartItem);

router.post("/cart/remove", session.checkAndRecreateSession, cartController.removeFromCart);