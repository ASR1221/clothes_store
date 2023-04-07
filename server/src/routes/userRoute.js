const userController = require("../controllers/userController");

const router = require("express").Router();


// TODO: get user address and phone number when he make an order
// TODO: payment
// TODO: facebook auth

//* Get id_token from front end and verify it
//* Save user if new
//* Send session and user info back to front end 


router.delete("/logout", userController.logout);    // TODO: implement later

router.post("/auth/google/user", userController.googleUser); 

router.post("/auth/facebook/user", userController.facebookUser); 


module.exports = router;