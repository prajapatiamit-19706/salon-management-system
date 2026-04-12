import Bill from "../models/bill.model.js";
import Appointment from "../models/appointment.model.js";
import { generateBillNumber } from "../utils/generateBillNumber.js";


// create bill
export const createBill = async (req, res) => {
    try {
        const { appointmentId, paymentMode } = req.body;

        const appointment = await Appointment.findById(appointmentId)
            .populate("serviceId")
            .populate("staffId");

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }
        const billNumberStr = await generateBillNumber();
        const bill = new Bill({
            billNumber: billNumberStr,
            customerId: appointment.userId,
            appointmentId,
            staffId: appointment.staffId._id,
            totalAmount: appointment.price,
            paymentMode,
            paymentStatus: "paid"
        });

        await bill.save();

        res.status(201).json({
            success: true,
            message: "Bill generated successfully",
            bill
        });

    } catch (error) {
        console.error("error", error);
        res.status(500).json({
            success: false,
            message: "Failed to generate bill"
        });
    }
};

// get all bill

export const getAllBill = async (req, res) => {
    try {

        const bills = await Bill.find()
            .populate("customerId", "name email")
            .populate("staffId", "name")
            .populate({
                path: "appointmentId",
                populate: {
                    path: "serviceId",
                    select: "name"
                }
            })
            .sort({ createdAt: -1 });

        if (!bills) {
            return res.status(400).json({
                success: false,
                message: "failed to fetch bill"
            })
        }

        const formattedBills = bills.map(bill => ({
            id: bill._id,
            customer: bill.customerId?.name || "Unknown",
            service: bill.appointmentId?.serviceId?.name || "Unknown",
            amount: bill.totalAmount,
            method: bill.paymentMode,
            status: bill.paymentStatus,
            date: new Date(bill.billDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
        }));

        res.status(200).json({
            success: true,
            bill: formattedBills
        })

    } catch (error) {
        console.error("fetch bill err:", error);
        res.status(500).json({
            success: false,
            message: "failed to fetch"
        });
    }
}