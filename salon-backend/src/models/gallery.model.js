import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    public_id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      trim: true,
      default: "",
    },
    type: {
      type: String,
      enum: ["image", "video"],
      default: "image",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Gallery", gallerySchema);
