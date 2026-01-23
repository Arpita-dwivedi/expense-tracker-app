const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const orderController = require("../controllers/orderController");

router.post("/premium", authMiddleware, orderController.createOrder);

module.exports = router;
