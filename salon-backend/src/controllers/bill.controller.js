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