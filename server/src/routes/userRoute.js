const userController = require("../controllers/userController");
const session = require("../middlewares/Session");

const router = require("express").Router();

// TODO: check session before any operation below
// TODO: add, remove and list cart items
// TODO: get user address and phone number when he make an order
// TODO: buy operation (order)
// TODO: payment


router.post("/auth/google/user", userController.googleUser, session);

router.post("/auth/google/user/mobile", userController.googleUser, session); 

router.post("/auth/facebook/user", userController.facebookUser, session); 

router.post("/auth/facebook/user/mobile", userController.facebookUser, session); 

router.post("/cart/list", userController.listCartItems);

router.post("/cart/add", userController.addToCart);

router.post("/cart/remove", userController.removeFromCart);



module.exports = router;