import cloudinary from "../config/cloudinary.js";

// POST /upload/image
export const uploadImage = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    return res.status(200).json({
      success: true,
      url: req.file.path,
      public_id: req.file.filename,
    });
  } catch (error) {
    console.error("Upload image error:", error);
    return res.status(500).json({ success: false, message: "Image upload failed", error: error.message });
  }
};

// POST /upload/video
export const uploadVideo = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    return res.status(200).json({
      success: true,
      url: req.file.path,
      public_id: req.file.filename,
    });
  } catch (error) {
    console.error("Upload video error:", error);
    return res.status(500).json({ success: false, message: "Video upload failed", error: error.message });
  }
};

// DELETE /upload/:publicId
export const deleteMedia = async (req, res) => {
  try {
    const { publicId } = req.params;

    if (!publicId) {
      return res.status(400).json({ success: false, message: "public_id is required" });
    }

    // Cloudinary public_ids with folders use "/" — the route param uses "-" as separator
    // e.g. "salon-staff-abc123" → "salon/staff/abc123"
    const decoded = decodeURIComponent(publicId);

    const result = await cloudinary.uploader.destroy(decoded);

    if (result.result === "ok" || result.result === "not found") {
      return res.status(200).json({ success: true, message: "Media deleted", result: result.result });
    }

    return res.status(400).json({ success: false, message: "Failed to delete media", result });
  } catch (error) {
    console.error("Delete media error:", error);
    return res.status(500).json({ success: false, message: "Delete failed", error: error.message });
  }
};
