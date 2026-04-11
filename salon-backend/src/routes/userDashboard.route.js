import express from "express";
import { updateProfile, userDashboard } from "../controllers/profile.Controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/user", authMiddleware, userDashboard);
router.put("/user", authMiddleware, updateProfile);

export default router;