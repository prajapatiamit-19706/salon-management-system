import express from "express";
import { adminOnly } from "../middleware/adminOnly.middleware.js";
import { authMiddleware } from "../middleware/authMiddleware.js"
import { getAllAppointments } from "../controllers/appointment.controller.js";
import { getAdminDashboardStats } from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/dashboard", authMiddleware, adminOnly, getAdminDashboardStats);
router.get("/appointments", authMiddleware, adminOnly, getAllAppointments);

export default router;
