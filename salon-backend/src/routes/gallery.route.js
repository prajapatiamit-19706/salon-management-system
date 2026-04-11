import express from "express";
import { getGalleryItems, addGalleryItem, deleteGalleryItem } from "../controllers/gallery.controller.js";
import { uploadGalleryMedia } from "../middleware/upload.middleware.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminOnly.middleware.js";

const router = express.Router();

// Public — fetch all gallery items
router.get("/", getGalleryItems);

// Admin — upload media to gallery
router.post("/", authMiddleware, adminOnly, uploadGalleryMedia.single("media"), addGalleryItem);

// Admin — delete gallery item
router.delete("/:id", authMiddleware, adminOnly, deleteGalleryItem);

export default router;
