import express from "express";
import fetchCustomers from "../controllers/customer.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminOnly.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, adminOnly, fetchCustomers);

export default router;