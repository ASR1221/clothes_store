const session = require("../middlewares/Session");
const checkRole = require("../middlewares/checkRole")
const adminsController = require("../controllers/adminsController");
const router = require("express").Router();

router.post("/check", session.checkAndRecreateSession, checkRole, adminsController.allowAccess);

router.post("/list/served", session.checkAndRecreateSession, checkRole, adminsController.listServedItems); // options ?from&to&section&type

router.post("/list/pending", session.checkAndRecreateSession, checkRole, adminsController.listPendingItems);

router.post("/item/add", session.checkAndRecreateSession, checkRole, adminsController.addNewItem);

module.exports = router;