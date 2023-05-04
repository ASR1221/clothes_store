const session = require("../middlewares/Session");
const checkRole = require("../middlewares/checkRole")
const upload = require("../middlewares/fileHandler");
const adminsController = require("../controllers/adminsController");
const router = require("express").Router();

router.get("/check", session.checkAndRecreateSession, checkRole, adminsController.allowAccess);

router.get("/list/served", session.checkAndRecreateSession, checkRole, adminsController.listServedItems); // query string ?from&to&section&type

router.get("/list/pending", session.checkAndRecreateSession, checkRole, adminsController.listPendingItems); // query string ?country&city

router.post("/item/add", session.checkAndRecreateSession, checkRole, upload, adminsController.addNewItem);

router.put("/item/update", session.checkAndRecreateSession, checkRole, adminsController.updateStock);

module.exports = router;