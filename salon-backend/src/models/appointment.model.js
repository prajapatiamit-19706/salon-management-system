import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    // Who booked
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // Which service (only ONE service)
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true
    },

    // Which staff
    staffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
      required: true
    },

    // Booking date (only date, no time)
    date: {
      type: String,   // "2026-03-01"
      required: true
    },

    // Time in minutes (recommended for easy calculation)
    startTime: {
      type: Number,   // example: 600 = 10:00 AM
      required: true
    },

    endTime: {
      type: Number,   // example: 630 = 10:30 AM
      required: true
    },

    // Store price snapshot (important!)
    price: {
      type: Number,
      required: true
    },

    // Appointment status
    status: {
      type: String,
      enum: ["booked", "completed", "cancelled"],
      default: "booked"
    }

  },
  { timestamps: true }
);

export default mongoose.model("Appointment", appointmentSchema);