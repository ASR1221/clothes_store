const router = require("express").Router();

router.use("/user", require("./routes/userRoute"))
router.use("/items", require("./routes/itemsRoute"))
router.use("/cart", require("./routes/cartRoute"))
router.use("/order", require("./routes/orderRoute"))

module.exports = router;