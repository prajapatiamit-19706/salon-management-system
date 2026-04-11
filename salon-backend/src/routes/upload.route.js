import express from "express";
import { uploadImage, uploadVideo, deleteMedia } from "../controllers/upload.controller.js";
import { uploadStaffImage, uploadGalleryMedia } from "../middleware/upload.middleware.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminOnly.middleware.js";

const router = express.Router();

// Upload single image (staff profile, etc.)
router.post("/image", authMiddleware, adminOnly, uploadStaffImage.single("image"), uploadImage);

// Upload single video
router.post("/video", authMiddleware, adminOnly, uploadGalleryMedia.single("video"), uploadVideo);

// Delete media by public_id
router.delete("/:publicId", authMiddleware, adminOnly, deleteMedia);

export default router;
