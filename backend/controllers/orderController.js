const orderService = require("../services/orderService");

const createOrder = async (req, res) => {
    try {
        const result = await orderService.createOrder(req.user.id);

        res.status(200).json({
            paymentSessionId: result.paymentSessionId,
            orderId: result.orderId
        });

    } catch (err) {
        console.error("CASHFREE ERROR:", err.response?.data || err);
        res.status(500).json({
            message: "Cashfree order failed",
            error: err.response?.data || err.message
        });
    }
};

const statusService = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const result = await orderService.checkPaymentStatus(orderId);

        res.status(200).json({
            message: result.success ? "Payment Successful" : "Payment Failed",
            success: result.success,
            orderStatus: result.orderStatus
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};

module.exports = { statusService, createOrder };
