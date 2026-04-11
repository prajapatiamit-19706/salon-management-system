import mongoose from "mongoose";

const billSchema = new mongoose.Schema(
    {
        billNumber: {
            type: String,
            unique: true,
            required: true
        },

        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        appointmentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Appointment",
            required: true
        },

        staffId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Staff",
            required: true
        },

        totalAmount: {
            type: Number,
            required: true
        },

        paymentMode: {
            type: String,
            enum: ["UPI", "Card", "Cash", "Online"],
            required: true
        },

        paymentStatus: {
            type: String,
            enum: ["pending", "paid"],
            default: "pending"
        },

        billDate: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: true }
);

export default mongoose.model("Bill", billSchema);