const Order = require("../models/orderModel");
const User = require("../models/userModel");
const { Cashfree, CFEnvironment } = require("cashfree-pg"); 
const cashfree = new Cashfree(CFEnvironment.SANDBOX, "TEST430329ae80e0f32e41a393d78b923034", "TESTaf195616268bd6202eeb3bf8dc458956e7192a85");

const createOrder = async (req, res) => {
    try {
        const orderId = "order_" + Date.now();


        await Order.create({
            id: orderId,
            status: "PENDING",
            UserId: req.user.id
        });

        const response = await cashfree.PGCreateOrder({
            order_id: orderId,
            order_amount: 499,
            order_currency: "INR",

            customer_details: {
                customer_id: String(req.user.id),
                customer_email: "test@test.com",
                customer_phone: "9999999999"
            },

            order_meta: {
                return_url: `http://localhost:3000/dashboard.html?paymentDone=true`
            },

            order_expiry_time: new Date(
                Date.now() + 60 * 60 * 1000
            ).toISOString()
        });


        res.status(200).json({
            paymentSessionId: response.data.payment_session_id,
            orderId: orderId
        });

    } catch (err) {
        console.error("CASHFREE ERROR:", err.response?.data || err);
        res.status(500).json({
            message: "Cashfree order failed",
            error: err.response?.data || err.message
        });
    }

};

const statusService = async (req, res, next) => {
    try {
        let id = req.params.orderId
        const response = await cashfree.PGOrderFetchPayments(id)
        let getOrderResponse = response.data;
        let orderStatus;
        if (getOrderResponse.filter(transaction => transaction.payment_status === "SUCCESS").length > 0) {
            orderStatus = "Success"
        } else if (getOrderResponse.filter(transaction => transaction.payment_status === "PENDING").length > 0) {
            orderStatus = "Pending"
        } else {
            orderStatus = "Failure"
        }
        let order = await Order.findOne({
            where: {
                id: id
            }
        })
        order.paymentStatus = orderStatus

        await order.save()
        if (orderStatus === "Success") {
            const user = await User.findByPk(order.UserId);
            user.isPremium = true;
            await user.save();
        }

        res.status(200).json({
            message: "Payment Scuccessful",
            success: true,
            orderStatus
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error", success: false});
    }
}
module.exports = { statusService, createOrder }