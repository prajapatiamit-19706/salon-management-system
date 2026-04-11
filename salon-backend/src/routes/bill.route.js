import express from "express";
import { createBill } from "../controllers/bill.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createBill);

export default router;