import mongoose from "mongoose";

// create service schema
const serviceSchema = new mongoose.Schema(
  {
    // Optional custom service code (srv-001)
    serviceCode: {
      type: String,
      unique: true,
    },
    displayOrder: {
    type: Number,
    default: 0
  },
    name: {
      type: String,
      required: true,
      trim: true,
    },

   category: {
  type: String,
  enum: [
    "hair",
    "beard",
    "spa",
    "facial",
    "makeup",
    "waxing",
    "nail",
    "eyebrow",
    "package"
  ],
  required: true
  },

    description: {
      type: String,
      trim: true,
    },

    gender: {
      type: String,
      enum: ["male", "female", "unisex"],
      required: true,
    },

    // duration in minutes (30 instead of "30 mins")
    duration: {
      type: Number,
      required: true,
    },

    // store only number (99 instead of "₹99")
    priceFrom: {
      type: Number,
      required: true,
    },
    tags: [
        {
          type: String,
          trim: true,
          lowercase: true
        }
      ],


    // store number (4.1 instead of "4.1")
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Service", serviceSchema);
