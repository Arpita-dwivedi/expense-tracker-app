const Order = require("../models/orderModel");
const User = require("../models/userModel");
const { Cashfree, CFEnvironment } = require("cashfree-pg");

const cashfree = new Cashfree(
    CFEnvironment.SANDBOX,
    process.env.CASHFREE_APP_ID,
    process.env.CASHFREE_SECRET_KEY
);

exports.createOrder = async (userId) => {
    const orderId = "order_" + Date.now();

    await Order.create({
        id: orderId,
        status: "PENDING",
        UserId: userId
    });

    const response = await cashfree.PGCreateOrder({
        order_id: orderId,
        order_amount: 499,
        order_currency: "INR",
        customer_details: {
            customer_id: String(userId),
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

    return {
        paymentSessionId: response.data.payment_session_id,
        orderId: orderId
    };
};

exports.checkPaymentStatus = async (orderId) => {
    const response = await cashfree.PGOrderFetchPayments(orderId);
    const getOrderResponse = response.data;

    let orderStatus;
    if (getOrderResponse.filter(transaction => transaction.payment_status === "SUCCESS").length > 0) {
        orderStatus = "Success";
    } else if (getOrderResponse.filter(transaction => transaction.payment_status === "PENDING").length > 0) {
        orderStatus = "Pending";
    } else {
        orderStatus = "Failure";
    }

    const order = await Order.findOne({
        where: { id: orderId }
    });

    if (order) {
        order.paymentStatus = orderStatus;
        await order.save();

        if (orderStatus === "Success") {
            const user = await User.findByPk(order.UserId);
            if (user) {
                user.isPremium = true;
                await user.save();
            }
        }
    }

    return {
        orderStatus,
        success: orderStatus === "Success"
    };
};
