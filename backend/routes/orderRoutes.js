const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const auth = require("../middleware/auth");

router.post("/premium",auth,  orderController.createOrder);

module.exports = router;
