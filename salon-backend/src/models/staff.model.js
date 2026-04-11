import mongoose from "mongoose";

const staffSchema = new mongoose.Schema(
  {
    // Optional readable staff code (stf-001)
    staffCode: {
      type: String,
      unique: true,
      trim: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    phone: {
      type: String,
      trim: true
    },

    role: {
      type: String,
      required: true,
      trim: true
    },

    experience: {
      type: Number, // years
      required: true,
      min: 0
    },

    specialties: [
      {
        type: String,
        trim: true
      }
    ],

    // skills used to match services
    skills: [
      {
        type: String,
        enum: ["hair", "beard", "spa", "facial", "makeup", "waxing", "nail", "eyebrow"],
        lowercase: true
      }
    ],

    gender: {
      type: String,
      enum: ["male", "female", "unisex"],
      lowercase: true,
      required: true
    },

    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },

    bio: {
      type: String,
      trim: true
    },

    image: {
      type: String // image URL or path
    },

    availability: [
      {
        type: String,
        enum: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      }
    ],

    socials: {
      instagram: {
        type: String,
        default: ""
      },
      facebook: {
        type: String,
        default: ""
      },
      twitter: {
        type: String,
        default: ""
      }
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Staff", staffSchema);
