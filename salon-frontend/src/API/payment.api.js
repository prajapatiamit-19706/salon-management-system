import { api } from "./axios.api";

// create Razorpay Order
export const createRazorpayOrder = async (amount) => {
    const res = await api.post("/payment/create-order", { amount });
    return res.data;
};

// verify Razorpay Payment
export const verifyRazorpayPayment = async (data) => {
    const res = await api.post("/payment/verify-payment", data);
    return res.data;
};
