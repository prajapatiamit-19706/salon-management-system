import Appointment from "../models/appointment.model.js";
import Service from "../models/services.model.js";
import User from "../models/user.model.js";
import Staff from "../models/staff.model.js";
import { sendAppointmentEmail } from "../utils/sendAppointmentEmail.js";
import { sendWhatsApp } from "../utils/sendWhatsApp.js";
import { sendFeedbackEmail } from "../utils/sendFeedbackEmail.js";

// Helper to format minutes into AM/PM
const formatTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const ampm = hours >= 12 ? "PM" : "AM";
  const h = hours % 12 || 12;
  return `${h}:${mins === 0 ? "00" : (mins < 10 ? "0" + mins : mins)} ${ampm}`;
};

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};


export const bookAppointment = async (req, res) => {
  try {

    const { serviceId, staffId, date, startTime } = req.body;
    const userId = req.user._id;

    const service = await Service.findById(serviceId);

    if (!service) {
      return res.status(404).json({
        message: "Service not found"
      });
    }

    const duration = service.duration;
    const endTime = startTime + duration;

    // 🔴 Critical check: prevent double booking
    const overlappingAppointment = await Appointment.findOne({
      staffId,
      date,
      status: "booked",
      $or: [
        {
          startTime: { $lt: endTime },
          endTime: { $gt: startTime }
        }
      ]
    });

    if (overlappingAppointment) {
      return res.status(400).json({
        success: false,
        message: "This slot has just been booked by another user. Please select another slot."
      });
    }

    const appointment = await Appointment.create({
      userId,
      serviceId,
      staffId,
      date,
      startTime,
      endTime,
      price: service.priceFrom,
      status: "booked"
    });

    // Fetch user and staff details for the confirmation email
    const [user, staff] = await Promise.all([
      User.findById(userId).lean(),
      Staff.findById(staffId).lean()
    ]);

    // Send the email asynchronously so it doesn't delay the API response
    if (user && user.email) {
      sendAppointmentEmail(user.email, {
        userName: user.name || "Client",
        serviceName: service.name,
        staffName: staff ? staff.name : "Our Staff",
        date: date,
        time: formatTime(startTime),
        price: service.priceFrom
      }).catch(err => {
        console.error("Failed to send appointment confirmation email:", err);
      });
    }

    if (staff && staff.phone) {
      const message = `✨ *New Booking Alert!*
        👤 *Customer:* ${user.name}
        📞 *Phone:* ${user.phone || "N/A"}

        💇 *Service:* ${service.name}
        👨‍🔧 *Assigned Staff:* ${staff.name}

        📅 *Date:* ${formatDate(date)}
        ⏰ *Time:* ${formatTime(startTime)}

        💰 *Total:* ₹${appointment.price}

        ⚡ Please prepare in advance.`;

      sendWhatsApp(staff.phone, message).catch(err => {
        console.error("Failed to send WhatsApp:", err);
      });
    }

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      appointment
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error"
    });
  }
};


// get available slots 
export const getAvailableSlots = async (req, res) => {
  try {
    const { serviceId, staffId, date } = req.query;

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const duration = service.duration;

    const salonOpen = 600;   // 10:00 AM
    const salonClose = 1200; // 8:00 PM

    // Get booked appointments
    const bookedAppointments = await Appointment.find({
      staffId,
      date,
      status: "booked"
    });

    let slots = [];

    // Get today's date
    const today = new Date().toISOString().split("T")[0];

    // Current time in minutes
    const now = new Date();
    const currentMinutes =
      now.getHours() * 60 + now.getMinutes();

    // Generate dynamic slots
    for (
      let time = salonOpen;
      time + duration <= salonClose;
      time += duration
    ) {

      const slotEnd = time + duration;

      // ❗ Skip past slots if selected date is today
      if (date === today && time <= currentMinutes) {
        continue;
      }

      const isBooked = bookedAppointments.some(
        (app) => time < app.endTime && slotEnd > app.startTime
      );

      if (!isBooked) {
        slots.push({
          startTime: time,
          endTime: slotEnd
        });
      }
    }

    res.json({
      success: true,
      slots
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error"
    });
  }
};


// cancel appointment 

export const cancelAppointment = async (req, res) => {
  try {

    const { id } = req.params;

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const appointment = await Appointment.findById(id)
      .populate("userId")
      .populate("serviceId")
      .populate("staffId");

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });
    }

    // prevent cancelling others' bookings
    const appointmentUserId = appointment.userId._id || appointment.userId;
    if (appointmentUserId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not allowed"
      });
    }

    appointment.status = "cancelled";

    await appointment.save();

    if (appointment.staffId && appointment.staffId.phone) {
      const message = `❌ *Booking Cancelled*
        👤 *Customer:* ${appointment.userId?.name || "N/A"}
        
        💇 *Service:* ${appointment.serviceId?.name || "N/A"}
        📅 *Date:* ${formatDate(appointment.date)}
        ⏰ *Time:* ${formatTime(appointment.startTime)}

        This appointment has been cancelled.`;

      sendWhatsApp(appointment.staffId.phone, message).catch(err => {
        console.error("Failed to send cancellation WhatsApp:", err);
      });
    }

    res.json({
      success: true,
      message: "Appointment cancelled successfully"
    });

  } catch (error) {

    console.error("Cancel Appointment Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


// fetch all appointment for admin 

export const getAllAppointments = async (req, res) => {
  try {

    const { status, date } = req.query;

    // build filter
    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (date) {
      filter.date = date;
    }

    const appointments = await Appointment.find(filter)
      .populate("userId", "name email")
      .populate("serviceId", "name priceFrom")
      .populate("staffId", "name role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      appointments
    });

  } catch (error) {

    console.error("Fetch Appointments Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch appointments"
    });

  }
};


export const cancelAppointmentAdmin = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: "cancelled" },
      { new: true }
    ).populate("userId").populate("serviceId").populate("staffId");

    if (appointment && appointment.staffId && appointment.staffId.phone) {
      const message = `❌ *Booking Cancelled by Admin*
        👤 *Customer:* ${appointment.userId?.name || "N/A"}
        
        💇 *Service:* ${appointment.serviceId?.name || "N/A"}
        📅 *Date:* ${formatDate(appointment.date)}
        ⏰ *Time:* ${formatTime(appointment.startTime)}

        The salon admin has cancelled this appointment.`;

      sendWhatsApp(appointment.staffId.phone, message).catch(err => {
        console.error("Failed to send cancellation WhatsApp:", err);
      });
    }

    res.status(200).json({
      success: true,
      appointment
    });
  } catch (error) {
    console.error("failed to update service:", error);

    res.status(500).json({
      success: false,
      message: "Failed to cancel appointment"
    });

  }
}

export const completeAppointmentAdmin = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("userId")
      .populate("serviceId")
      .populate("staffId");

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Only send feedback email if it wasn't already completed (by cron)
    const wasAlreadyCompleted = appointment.status === "completed";

    appointment.status = "completed";
    await appointment.save();

    // Send feedback email only if this is the first time being completed
    if (!wasAlreadyCompleted) {
      const user = appointment.userId;
      if (user && user.email) {
        const feedbackLink = `http://localhost:5173/feedback?appointmentId=${appointment._id}`;

        sendFeedbackEmail(user.email, {
          appointmentId: appointment._id,
          userName: user.name || "Client",
          serviceName: appointment.serviceId?.name || "Service",
          staffName: appointment.staffId?.name || "Our Staff",
          date: appointment.date,
          time: formatTime(appointment.startTime),
          feedbackLink,
        }).catch((err) => {
          console.error("Failed to send feedback email:", err);
        });
      }
    }

    res.status(200).json({
      success: true,
      appointment,
    });
  } catch (error) {
    console.error("failed to complete appointment:", error);

    res.status(500).json({
      success: false,
      message: "Failed to complete appointment",
    });
  }
};

