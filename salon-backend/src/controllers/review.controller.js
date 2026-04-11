import Review from "../models/feedback.model.js";
import Appointment from "../models/appointment.model.js";

export const submitReview = async (req, res) => {
  try {
    const { appointmentId, rating, review } = req.body;

    // Validate input
    if (!appointmentId || !rating) {
      return res.status(400).json({
        success: false,
        message: "Appointment ID and rating are required",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    // Validate appointment exists
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Prevent duplicate reviews
    const existingReview = await Review.findOne({ appointmentId });

    if (existingReview) {
      return res.status(409).json({
        success: false,
        message: "Feedback has already been submitted for this appointment",
      });
    }

    // Create review using data from the appointment
    const newReview = await Review.create({
      userId: appointment.userId,
      appointmentId: appointment._id,
      serviceId: appointment.serviceId,
      staffId: appointment.staffId,
      rating,
      review: review || "",
    });

    res.status(201).json({
      success: true,
      message: "Thank you! Your feedback has been submitted successfully",
      review: newReview,
    });
  } catch (error) {
    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Feedback has already been submitted for this appointment",
      });
    }

    console.error("Submit Review Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

// Get all reviews (public, no auth)
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("userId", "name")
      .populate("serviceId", "name")
      .populate("staffId", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error("Fetch Reviews Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
    });
  }
};