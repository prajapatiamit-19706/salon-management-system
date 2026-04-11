import Gallery from "../models/gallery.model.js";
import cloudinary from "../config/cloudinary.js";

// GET /gallery — fetch all gallery items
export const getGalleryItems = async (req, res) => {
  try {
    const items = await Gallery.find().sort({ createdAt: -1 });
    return res.status(200).json(items);
  } catch (error) {
    console.error("Fetch gallery error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch gallery", error: error.message });
  }
};

// POST /gallery — upload media and save to DB
export const addGalleryItem = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const { title } = req.body;

    // Determine type from mimetype
    const isVideo = req.file.mimetype?.startsWith("video");

    const item = new Gallery({
      url: req.file.path,
      public_id: req.file.filename,
      title: title || req.file.originalname?.replace(/\.[^.]+$/, "") || "Untitled",
      type: isVideo ? "video" : "image",
    });

    await item.save();

    return res.status(201).json({
      success: true,
      message: "Gallery item added",
      item,
    });
  } catch (error) {
    console.error("Add gallery item error:", error);
    return res.status(500).json({ success: false, message: "Failed to add gallery item", error: error.message });
  }
};

// DELETE /gallery/:id — remove from Cloudinary + DB
export const deleteGalleryItem = async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: "Gallery item not found" });
    }

    // Delete from Cloudinary
    if (item.public_id) {
      const resourceType = item.type === "video" ? "video" : "image";
      await cloudinary.uploader.destroy(item.public_id, { resource_type: resourceType });
    }

    // Delete from DB
    await Gallery.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Gallery item deleted",
    });
  } catch (error) {
    console.error("Delete gallery item error:", error);
    return res.status(500).json({ success: false, message: "Failed to delete gallery item", error: error.message });
  }
};
