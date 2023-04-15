const router = require("express").Router();

router.use("/user", require("./userRoute"));
router.use("/items", require("./itemsRoute"));
router.use("/cart", require("./cartRoute"));
router.use("/order", require("./orderRoute"));
router.use("/admin", require("./adminsRoute"));

module.exports = router;