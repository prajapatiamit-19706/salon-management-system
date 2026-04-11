import User from "../models/user.model.js";
import Appointment from "../models/appointment.model.js";
import Bill from "../models/bill.model.js";

export const userDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    // get user info
    const user = await User.findById(userId).select("-password");

    // get all appointments
    let appointments = await Appointment.find({ userId })
      .populate("serviceId")
      .populate("staffId")
      .sort({ date: -1 })
      .lean();

    // get all bills for these appointments
    const appointmentIds = appointments.map(a => a._id);
    const bills = await Bill.find({ appointmentId: { $in: appointmentIds } }).lean();

    // Create a map of appointmentId -> bill
    const billMap = {};
    bills.forEach(bill => {
      billMap[bill.appointmentId.toString()] = bill;
    });

    appointments = appointments.map(a => ({
      ...a,
      bill: billMap[a._id.toString()] || null
    }));

    const now = new Date();

    const upcomingAppointments = [];
    const completedAppointments = [];
    const cancelledAppointments = [];

    appointments.forEach((appointment) => {

      // Cancelled stays cancelled
      if (appointment.status === "cancelled") {
        cancelledAppointments.push(appointment);
        return;
      }

      // Convert appointment endTime to actual Date
      const appointmentDate = new Date(appointment.date);

      const endHour = Math.floor(appointment.endTime / 60);
      const endMinute = appointment.endTime % 60;

      appointmentDate.setHours(endHour, endMinute, 0, 0);

      // If appointment time passed → completed
      if (appointmentDate < now) {
        if (appointment.status === "booked") {
          appointment.status = "completed";
          Appointment.findByIdAndUpdate(appointment._id, { status: "completed" }).exec().catch(console.error);
        }
        completedAppointments.push(appointment);
      } else {
        upcomingAppointments.push(appointment);
      }

    });

    // Stats
    const stats = {
      total: appointments.length,
      upcoming: upcomingAppointments.length,
      completed: completedAppointments.length,
      cancelled: cancelledAppointments.length
    };

    // Calculate favorite staff
    const staffCount = {};

    appointments.forEach((a) => {
      const name = a.staffId?.name;
      if (!name) return;

      staffCount[name] = (staffCount[name] || 0) + 1;
    });

    let favoriteStaff = null;

    if (Object.keys(staffCount).length > 0) {
      favoriteStaff = Object.entries(staffCount)
        .sort((a, b) => b[1] - a[1])[0][0];
    }

    res.status(200).json({
      success: true,
      user,
      stats,
      upcomingAppointments,
      completedAppointments,
      cancelledAppointments,
      favoriteStaff
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to load dashboard"
    });
  }
};

// update profile
export const updateProfile = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id,
      { name, email, phone }
      , { new: true });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user
    })

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile"
    })
  }
}