import express from "express";
import { bookAppointment, cancelAppointment, getAllAppointments, getAvailableSlots, cancelAppointmentAdmin, completeAppointmentAdmin } from "../controllers/appointment.controller.js"
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminOnly.middleware.js"

const router = express.Router();

router.post("/book", authMiddleware, bookAppointment);
router.get("/available-slots", getAvailableSlots);
router.patch("/cancel/:id", authMiddleware, cancelAppointment);
router.get("/all", getAllAppointments);


// for admin
router.patch(
    "/:id/cancel",
    authMiddleware,
    adminOnly,
    cancelAppointmentAdmin
);

router.patch(
    "/:id/complete",
    authMiddleware,
    adminOnly,
    completeAppointmentAdmin
);

export default router;