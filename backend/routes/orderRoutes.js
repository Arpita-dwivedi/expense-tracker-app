const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const orderController = require("../controllers/orderController");

router.post("/premium", authMiddleware, orderController.createOrder);
router.get('/premium/:orderId',orderController.statusService)

module.exports = router;
