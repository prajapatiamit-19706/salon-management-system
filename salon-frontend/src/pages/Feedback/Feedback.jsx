import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { submitReviewApi } from "../../API/review.api";
import "./Feedback.css";

const starLabels = ["Terrible", "Poor", "Average", "Good", "Excellent"];

export const Feedback = () => {
  const [searchParams] = useSearchParams();
  const appointmentId = searchParams.get("appointmentId");
  const navigate = useNavigate();

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | duplicate | error
  const [errorMsg, setErrorMsg] = useState("");
  const [countdown, setCountdown] = useState(5);

  // Redirect to home after 5 seconds on success
  useEffect(() => {
    if (status !== "success") return;

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const redirect = setTimeout(() => {
      navigate("/");
    }, 5000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirect);
    };
  }, [status, navigate]);

  const activeRating = hoverRating || rating;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!appointmentId) {
      setErrorMsg("Invalid feedback link. No appointment ID found.");
      setStatus("error");
      return;
    }

    if (rating === 0) {
      setErrorMsg("Please select a star rating before submitting.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      await submitReviewApi({
        appointmentId,
        rating,
        review,
      });
      setStatus("success");
    } catch (err) {
      const msg =
        err?.response?.data?.message || "Something went wrong. Please try again.";

      if (err?.response?.status === 409) {
        setStatus("duplicate");
      } else {
        setErrorMsg(msg);
        setStatus("error");
      }
    }
  };

  // No appointment ID
  if (!appointmentId) {
    return (
      <div className="feedback-page">
        <div className="feedback-card feedback-card--error">
          <div className="feedback-icon-wrap">
            <span className="feedback-icon">⚠️</span>
          </div>
          <h2 className="feedback-title">Invalid Link</h2>
          <p className="feedback-subtitle">
            This feedback link is missing the appointment reference. Please use the
            link from your email.
          </p>
        </div>
      </div>
    );
  }

  // Success state
  if (status === "success") {
    return (
      <div className="feedback-page">
        <div className="feedback-card feedback-card--success">
          <div className="feedback-icon-wrap feedback-icon-wrap--success">
            <span className="feedback-icon">🎉</span>
          </div>
          <h2 className="feedback-title">Thank You!</h2>
          <p className="feedback-subtitle">
            Your feedback has been submitted successfully. We truly appreciate you
            taking the time to share your experience!
          </p>
          <div className="feedback-stars-display">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`feedback-star-static ${
                  star <= rating ? "feedback-star-static--active" : ""
                }`}
              >
                ★
              </span>
            ))}
          </div>
          <p className="feedback-redirect">
            Redirecting to home page in <strong>{countdown}</strong> second{countdown !== 1 ? "s" : ""}...
          </p>
        </div>
      </div>
    );
  }

  // Already submitted
  if (status === "duplicate") {
    return (
      <div className="feedback-page">
        <div className="feedback-card feedback-card--duplicate">
          <div className="feedback-icon-wrap feedback-icon-wrap--duplicate">
            <span className="feedback-icon">✅</span>
          </div>
          <h2 className="feedback-title">Already Submitted</h2>
          <p className="feedback-subtitle">
            You've already submitted feedback for this appointment. Thank you for
            sharing your experience with us!
          </p>
        </div>
      </div>
    );
  }

  // Feedback form
  return (
    <div className="feedback-page">
      <div className="feedback-card">
        {/* Header */}
        <div className="feedback-header">
          <div className="feedback-icon-wrap">
            <span className="feedback-icon">⭐</span>
          </div>
          <h2 className="feedback-title">Share Your Feedback</h2>
          <p className="feedback-subtitle">
            We'd love to hear about your experience. Your feedback helps us improve!
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="feedback-form">
          {/* Star rating */}
          <div className="feedback-rating-section">
            <label className="feedback-label">How would you rate your experience?</label>
            <div className="feedback-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`feedback-star-btn ${
                    star <= activeRating ? "feedback-star-btn--active" : ""
                  }`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                >
                  ★
                </button>
              ))}
            </div>
            {activeRating > 0 && (
              <span className="feedback-star-label">{starLabels[activeRating - 1]}</span>
            )}
          </div>

          {/* Review textarea */}
          <div className="feedback-review-section">
            <label htmlFor="review-text" className="feedback-label">
              Write a review <span className="feedback-optional">(optional)</span>
            </label>
            <textarea
              id="review-text"
              className="feedback-textarea"
              rows="4"
              placeholder="Tell us what you liked or how we can improve..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              maxLength={500}
            />
            <span className="feedback-char-count">{review.length}/500</span>
          </div>

          {/* Error message */}
          {status === "error" && errorMsg && (
            <div className="feedback-error">{errorMsg}</div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            className="feedback-submit-btn"
            disabled={status === "loading" || rating === 0}
          >
            {status === "loading" ? (
              <span className="feedback-spinner" />
            ) : (
              "Submit Feedback"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
