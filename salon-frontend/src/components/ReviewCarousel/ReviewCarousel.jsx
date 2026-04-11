import { useState, useRef, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAllReviews } from "../../API/review.api";
import "./ReviewCarousel.css";

const StarDisplay = ({ rating }) => (
  <div className="rc-stars">
    {[1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        className={`rc-star ${star <= rating ? "rc-star--filled" : ""}`}
      >
        ★
      </span>
    ))}
  </div>
);

// Get initials from name
const getInitials = (name) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export const ReviewCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const directionRef = useRef("right");

  const {
    data: reviews = [],
    isPending,
    isError,
  } = useQuery({
    queryKey: ["reviews"],
    queryFn: fetchAllReviews,
    staleTime: 5 * 60 * 1000,
  });

  const goTo = useCallback((index) => {
    const total = reviews.length;
    if (animating || total <= 1) return;

    // Determine direction
    directionRef.current = index > currentIndex || (currentIndex === total - 1 && index === 0)
      ? "right"
      : "left";
    if (currentIndex === 0 && index === total - 1) directionRef.current = "left";

    setAnimating(true);

    setTimeout(() => {
      if (index < 0) setCurrentIndex(total - 1);
      else if (index >= total) setCurrentIndex(0);
      else setCurrentIndex(index);
      setAnimating(false);
    }, 300);
  }, [animating, currentIndex, reviews.length]);

  if (isPending) return null;
  if (isError || reviews.length === 0) return null;

  const total = reviews.length;

  const prevIndex = (currentIndex - 1 + total) % total;
  const nextIndex = (currentIndex + 1) % total;

  const renderCard = (review, position) => {
    const userName = review.userId?.name || "Anonymous";
    const serviceName = review.serviceId?.name || "";
    const staffName = review.staffId?.name || "";

    return (
      <div className={`rc-card rc-card--${position}`} key={review._id}>
        {/* Avatar */}
        <div className="rc-avatar">{getInitials(userName)}</div>

        {/* Stars */}
        <StarDisplay rating={review.rating} />

        {/* Review text */}
        {review.review && <p className="rc-review-text">"{review.review}"</p>}

        {/* User info */}
        <h4 className="rc-user-name">{userName}</h4>

        {/* Meta */}
        <div className="rc-meta">
          {serviceName && <span className="rc-service">{serviceName}</span>}
          {staffName && (
            <>
              <span className="rc-dot">•</span>
              <span className="rc-staff">with {staffName}</span>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <section className="rc-section">
      <h2 className="rc-heading">What Our Clients Say About Us</h2>
      <p className="rc-subheading">
        Real feedback from our valued customers
      </p>

      <div className={`rc-carousel-wrapper ${animating ? `rc-carousel-wrapper--animating rc-carousel-wrapper--${directionRef.current}` : ""}`}>
        {/* Previous (faded left) */}
        {total > 1 && (
          <div className="rc-side rc-side--left" onClick={() => goTo(currentIndex - 1)}>
            {renderCard(reviews[prevIndex], "prev")}
          </div>
        )}

        {/* Current (center) */}
        <div className="rc-center">
          {renderCard(reviews[currentIndex], "current")}
        </div>

        {/* Next (faded right) */}
        {total > 1 && (
          <div className="rc-side rc-side--right" onClick={() => goTo(currentIndex + 1)}>
            {renderCard(reviews[nextIndex], "next")}
          </div>
        )}
      </div>

      {/* Navigation arrows & dots */}
      {total > 1 && (
        <div className="rc-nav">
          <button
            className="rc-arrow rc-arrow--left"
            onClick={() => goTo(currentIndex - 1)}
            aria-label="Previous review"
          >
            ‹
          </button>

          <div className="rc-dots">
            {reviews.map((_, i) => (
              <button
                key={i}
                className={`rc-dot-btn ${i === currentIndex ? "rc-dot-btn--active" : ""}`}
                onClick={() => goTo(i)}
                aria-label={`Go to review ${i + 1}`}
              />
            ))}
          </div>

          <button
            className="rc-arrow rc-arrow--right"
            onClick={() => goTo(currentIndex + 1)}
            aria-label="Next review"
          >
            ›
          </button>
        </div>
      )}
    </section>
  );
};
