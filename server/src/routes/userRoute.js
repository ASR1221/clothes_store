const userController = require("../controllers/userController");
const session = require("../middlewares/Session");

const router = require("express").Router();


// TODO: get user address and phone number when he make an order
// TODO: buy operation (order)
// TODO: payment

// TODO: create to seperate path for mobile and web
router.post("/auth/google/user", userController.googleUser, session.createSession);

router.post("/auth/facebook/user", userController.facebookUser, session.createSession); 


module.exports = router;