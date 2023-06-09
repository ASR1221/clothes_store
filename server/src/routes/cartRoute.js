const cartController = require("../controllers/cartController");
const session = require("../middlewares/Session");

const router = require("express").Router();

router.post("/add", session.checkAndRecreateSession, cartController.addToCart);

router.get("/list", session.checkAndRecreateSession, cartController.listCartItems);

router.put("/update", session.checkAndRecreateSession, cartController.updateCartItem);

router.delete("/remove/:id", session.checkAndRecreateSession, cartController.removeFromCart);

module.exports = router;