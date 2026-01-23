const { Cashfree } = require("cashfree-pg");
const Order = require("../models/orderModel");

exports.createOrder = async (req, res) => {
    try {
        const orderId = "order_" + Date.now();

        
        await Order.create({
            id: orderId,
            status: "PENDING",
            UserId: req.user.id
        });

        
        const cashfree = new Cashfree({
            env: "SANDBOX",                
            appId: "TEST109646921a9e71a0d7f5a0cabeb229646901",       
            secretKey: "cfsk_ma_test_0e93d7cf0423b91e97ab99e3a8dc897f_f6bb9c1f"
        });

        
        const response = await cashfree.PGCreateOrder({
            order_id: orderId,
            order_amount: 499,
            order_currency: "INR",
            customer_details: {
                customer_id: req.user.id.toString(),
                customer_email: req.user.email,
                customer_phone: "9999999999"
            }
        });

    
        res.status(200).json({
            paymentSessionId: response.data.payment_session_id,
            orderId: orderId
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Cashfree order failed" });
    }
};
