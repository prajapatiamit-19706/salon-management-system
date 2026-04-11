import { razorpay } from "../config/razorpay.js";
import crypto from "crypto";

export const createOrder = async (req, res) => {
    try {
        const { amount } = req.body;

        const options = {
            amount: amount * 100, // paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);

        res.json({
            success: true,
            order
        });

    } catch (error) {
        res.status(500).json({ message: "Order creation failed" });
    }
};

export const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            bookingData
        } = req.body;

        const body =
            razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Payment verification failed"
            });
        }

        // Return success so the frontend can safely proceed with booking 
        // using the established API flow
        res.json({
            success: true,
            message: "Payment successful"
        });

    } catch (error) {
        res.status(500).json({ message: "Verification failed" });
    }
};