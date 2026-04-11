import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

// ── Helper: create a Cloudinary-backed multer instance ──────────
const createUploader = (folder, allowedFormats, resourceType = "image", maxSize = 5 * 1024 * 1024) => {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder,
      resource_type: resourceType,
      allowed_formats: allowedFormats,
      transformation:
        resourceType === "image"
          ? [{ quality: "auto", fetch_format: "auto" }]
          : undefined,
    },
  });

  return multer({
    storage,
    limits: { fileSize: maxSize },
    fileFilter: (_req, file, cb) => {
      // Build a whitelist from the allowed formats
      const mimeWhitelist =
        resourceType === "image"
          ? ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"]
          : ["image/jpeg", "image/png", "image/webp", "image/gif", "video/mp4", "video/webm", "video/quicktime"];

      if (mimeWhitelist.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error(`File type "${file.mimetype}" is not allowed.`), false);
      }
    },
  });
};

// ── Pre-built uploaders for each domain ─────────────────────────

/** Staff profile images — salon/staff */
export const uploadStaffImage = createUploader(
  "salon/staff",
  ["jpg", "jpeg", "png", "webp", "gif"],
  "image",
  5 * 1024 * 1024 // 5 MB
);

/** Gallery media (images + videos) — salon/gallery */
export const uploadGalleryMedia = createUploader(
  "salon/gallery",
  ["jpg", "jpeg", "png", "webp", "gif", "mp4", "webm", "mov"],
  "auto",
  20 * 1024 * 1024 // 20 MB
);