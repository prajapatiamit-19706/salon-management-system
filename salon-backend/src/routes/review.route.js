import express from "express";
import { submitReview, getAllReviews } from "../controllers/review.controller.js";

const router = express.Router();

// No auth middleware — public endpoints
router.post("/submit", submitReview);
router.get("/all", getAllReviews);

export default router;
