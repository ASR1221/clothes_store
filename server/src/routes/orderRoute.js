const orderController = require("../controllers/orderController");
const session = require("../middlewares/Session");

const router = require("express").Router();

router.post("/make", session.checkAndRecreateSession, orderController.makeOrder);

router.post("/get", session.checkAndRecreateSession, orderController.getOrder);

module.exports = router;
