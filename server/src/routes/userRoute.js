const userController = require("../controllers/userController");
const session = require("../middlewares/Session");

const router = require("express").Router();


// TODO: get user address and phone number when he make an order
// TODO: buy operation (order)
// TODO: payment

// TODO: create to seperate path for mobile and web
router.post("/auth/google", userController.googleUser, session.createSession);

router.post("/auth/facebook", userController.facebookUser, session.createSession); 

router.post("/info/set", session.checkAndRecreateSession, userController.setUserInfo);

router.post("/info/get", session.checkAndRecreateSession, userController.getUserInfo);

module.exports = router;