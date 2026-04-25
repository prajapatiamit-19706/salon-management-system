import express from "express";
import cors from "cors";
import serviceRoute from "./routes/services.route.js"
import staffRoute from "./routes/staff.route.js";
import authRoute from "./routes/auth.route.js";
import appointmentRoute from "./routes/appointment.route.js";
import userDashboardRoute from "./routes/userDashboard.route.js"
import adminRoute from "./routes/admin.route.js"
import adminAppointmentRoute from "./routes/appointment.route.js"
import customerRoute from "./routes/customer.route.js"
import adminStaffRoute from "./routes/staff.route.js"
import billRoute from "./routes/bill.route.js"
import reviewRoute from "./routes/review.route.js"
import uploadRoute from "./routes/upload.route.js"
import galleryRoute from "./routes/gallery.route.js"
import paymentRoute from "./routes/payment.route.js"
import chatRoute from "./routes/chat.route.js"

const app = express();

// some middlewares
app.use(express.json())
// backend/server.js

app.use(cors({
    origin: ['http://localhost:5173', 'https://salon-management-system-iota.vercel.app'], // Add your dev and prod URLs
    methods: ['GET', 'POST'],
    credentials: true
}));
app.use(express.urlencoded({ extended: true }))

//imp
app.use("/services", serviceRoute);
app.use("/staffs", staffRoute);
app.use("/auth", authRoute);
app.use("/appointments", appointmentRoute);
app.use("/dashboard", userDashboardRoute)
app.use("/admin", adminRoute);
app.use("/admin/appointments", adminAppointmentRoute)
app.use("/admin/customers", customerRoute);
app.use("/admin/staffs", adminStaffRoute);
app.use("/bill", billRoute);
app.use("/reviews", reviewRoute);
app.use("/upload", uploadRoute);
app.use("/gallery", galleryRoute);
app.use("/payment", paymentRoute);
app.use("/message", chatRoute)
app.get('/api/health', (req, res) => res.status(200).json({ status: 'ok' }));

export default app;
