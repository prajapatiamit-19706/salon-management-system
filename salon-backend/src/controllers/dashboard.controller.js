import Appointment from "../models/appointment.model.js";
import User from "../models/user.model.js";

export const getAdminDashboardStats = async (req, res) => {
  try {
    const rawAppointments = await Appointment.find({})
      .populate("userId", "name email phone")
      .populate("serviceId", "name priceFrom category")
      .populate("staffId", "name role")
      .sort({ createdAt: -1 });
      
    // Auto complete past appointments dynamically
    const now = new Date();
    const appointments = rawAppointments.map((appointment) => {
      if (appointment.status === "booked") {
        const appointmentDate = new Date(appointment.date);
        const endHour = Math.floor(appointment.endTime / 60);
        const endMinute = appointment.endTime % 60;
        appointmentDate.setHours(endHour, endMinute, 0, 0);

        if (appointmentDate < now) {
          appointment.status = "completed";
          Appointment.findByIdAndUpdate(appointment._id, { status: "completed" }).exec().catch(console.error);
        }
      }
      return appointment;
    });

    // Customers count
    const customersCount = await User.countDocuments({ role: "user" });

    const recentAppointments = [...appointments]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);

    // Chart: monthly revenue (last 6 months)
    const monthlyRevenue = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      monthlyRevenue.push({ 
        month: d.toLocaleDateString("en-US", { month: "short" }), 
        revenue: 0, 
        _year: d.getFullYear(), 
        _month: d.getMonth() 
      });
    }

    const staffStatsMap = {};

    appointments.filter(a => a.status === "completed").forEach((apt) => {
      const d = new Date(apt.date);
      const yr = d.getFullYear();
      const mo = d.getMonth();
      const entry = monthlyRevenue.find(m => m._year === yr && m._month === mo);
      if (entry) {
        entry.revenue += apt.price;
      }

      const staffId = apt.staffId?._id || apt.staffId;
      const staffName = apt.staffId?.name || "Unknown";
      if (!staffStatsMap[staffId]) {
        staffStatsMap[staffId] = { name: staffName, appointments: 0, revenue: 0, rating: "4.9" };
      }
      staffStatsMap[staffId].appointments += 1;
      staffStatsMap[staffId].revenue += apt.price;
    });

    const staffPerformance = Object.values(staffStatsMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 3);

    const completedRevenue = appointments
      .filter(a => a.status === "completed")
      .reduce((total, apt) => total + apt.price, 0);

    const stats = {
      totalAppointments: appointments.length,
      upcoming: appointments.filter((a) => a.status === "booked").length,
      completed: appointments.filter((a) => a.status === "completed").length,
      cancelled: appointments.filter((a) => a.status === "cancelled").length,
      totalCustomers: customersCount,
      totalRevenue: completedRevenue
    };

    res.status(200).json({
      success: true,
      stats,
      monthlyRevenue,
      staffPerformance,
      recentAppointments
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ success: false, message: "Failed to load dashboard data" });
  }
};
