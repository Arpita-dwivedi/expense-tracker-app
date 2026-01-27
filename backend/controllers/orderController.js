const { Cashfree } = require("cashfree-pg");


Cashfree.XClientId = "TEST109646921a9e71a0d7f5a0cabeb229646901";
Cashfree.XClientSecret = "cfsk_ma_test_0e93d7cf0423b91e97ab99e3a8dc897f_f6bb9c1f";
Cashfree.XEnvironment = "SANDBOX";
const Order = require("../models/orderModel");

exports.createOrder = async (req, res) => {
    try {
        const orderRequest = {
            order_id: "order_" + Date.now(),
            order_amount: 499,
            order_currency: "INR",
            customer_details: {
                customer_id: "user_" + req.user.id,
                customer_email: req.user.email,
                customer_phone: "9999999999"
            },
            order_meta: {
                return_url: "https://www.cashfree.com/devstudio/preview/pg/web/popupCheckout?order_id={order_id}"
            }
        };
        const response = await Cashfree.PGCreateOrder(orderRequest);

        res.status(200).json({
            paymentSessionId: response.data.payment_session_id,
            orderId: response.data.order_id
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Order creation failed" });
    }
};
