import cron from "node-cron";
import Appointment from "../models/appointment.model.js";
import { sendFeedbackEmail } from "../utils/sendFeedbackEmail.js";

// Helper to format minutes into AM/PM
const formatTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const ampm = hours >= 12 ? "PM" : "AM";
  const h = hours % 12 || 12;
  return `${h}:${mins === 0 ? "00" : mins < 10 ? "0" + mins : mins} ${ampm}`;
};

/**
 * Runs every 5 minutes.
 * Finds all "booked" appointments whose end time has passed,
 * marks them as "completed", and sends a feedback email.
 */
export const startAutoCompleteCron = () => {
  // "*/5 * * * *" = every 5 minutes
  cron.schedule("*/5 * * * *", async () => {
    try {
      const now = new Date();
      const todayStr = now.toISOString().split("T")[0]; // "YYYY-MM-DD"
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      // Find all booked appointments that have ended
      // Case 1: appointment date is before today (past days)
      // Case 2: appointment date is today AND endTime <= current time
      const expiredAppointments = await Appointment.find({
        status: "booked",
        $or: [
          { date: { $lt: todayStr } },
          { date: todayStr, endTime: { $lte: currentMinutes } },
        ],
      })
        .populate("userId", "name email")
        .populate("serviceId", "name")
        .populate("staffId", "name");

      if (expiredAppointments.length === 0) return;

      console.log(
        `[CRON] Found ${expiredAppointments.length} expired appointment(s) to auto-complete`
      );

      for (const appointment of expiredAppointments) {
        // Mark as completed
        appointment.status = "completed";
        await appointment.save();

        // Send feedback email
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
            console.error(
              `[CRON] Failed to send feedback email for appointment ${appointment._id}:`,
              err
            );
          });
        }

        console.log(
          `[CRON] ✅ Auto-completed appointment ${appointment._id} → feedback email sent to ${user?.email || "N/A"}`
        );
      }
    } catch (error) {
      console.error("[CRON] Auto-complete job error:", error);
    }
  });

  console.log("[CRON] ⏰ Auto-complete appointments job scheduled (every 5 min)");
};
