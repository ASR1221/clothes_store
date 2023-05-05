const orderController = require("../controllers/orderController");
const session = require("../middlewares/Session");

const router = require("express").Router();

router.post("/make", session.checkAndRecreateSession, orderController.makeOrder);

router.get("/list", session.checkAndRecreateSession, orderController.getOrder);

router.get("/details/:id", session.checkAndRecreateSession, orderController.getOrderDetails);

module.exports = router;
