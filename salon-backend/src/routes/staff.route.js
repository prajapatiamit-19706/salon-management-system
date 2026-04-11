import express from "express";
import { createStaff, getAllStaff, getSingleStaff, getStaff, removeStaff, updateStaff } from "../controllers/staff.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminOnly.middleware.js";

const router = express.Router();

router.get("/", getStaff);
router.get("/:id", getSingleStaff);

router.get("/", authMiddleware, adminOnly, getAllStaff);
router.delete("/:id", authMiddleware, adminOnly, removeStaff);
router.post("/", authMiddleware, adminOnly, createStaff);
router.put("/:id", authMiddleware, adminOnly, updateStaff);

export default router;