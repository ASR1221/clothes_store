const itemsController = require("../controllers/itemsController");

const router = require("express").Router();

router.get("/list", itemsController.list); // must send query params like => /list?section=men&type=jeans  //* type is optional

router.get("/details/:id", itemsController.list);

router.get("/search", itemsController.searchItem); // query string ?term=

module.exports = router;