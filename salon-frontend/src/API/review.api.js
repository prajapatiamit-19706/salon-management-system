import { api } from "./axios.api";

// Submit feedback (no auth required)
export const submitReviewApi = async (data) => {
  const res = await api.post("/reviews/submit", data);
  return res.data;
};

// Fetch all reviews (public)
export const fetchAllReviews = async () => {
  const res = await api.get("/reviews/all");
  return res.data.reviews;
};
