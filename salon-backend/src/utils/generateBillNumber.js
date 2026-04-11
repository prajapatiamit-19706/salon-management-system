import Bill from "../models/bill.model.js";

export const generateBillNumber = async () => {
    const lastBill = await Bill.findOne().sort({ createdAt: -1 });
    let nextNumber = 1;

    if (lastBill) {
        const lastNumber = parseInt(lastBill.billNumber.split("-")[1]);
        nextNumber = lastNumber + 1;
    }

    return `BILL - ${nextNumber}`;
};