import express from "express";
import { createBill, getAllBill } from "../controllers/bill.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createBill);
router.get("/payments", authMiddleware, getAllBill);

export default router;