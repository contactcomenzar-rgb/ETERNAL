const Review = require("../models/Review");

function parseNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseDate(value) {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isFinite(parsed.getTime()) ? parsed : null;
}

exports.getReviews = async (req, res) => {
  const reviews = await Review.find().sort({ createdAt: -1 });
  res.json(reviews);
};

exports.createReview = async (req, res) => {
  const payload = { ...req.body };

  const lowerEndDate = String(payload.endDate || "").trim().toLowerCase();
  payload.isOngoing = Boolean(payload.isOngoing) || lowerEndDate === "present";
  payload.endDate = payload.isOngoing ? null : parseDate(payload.endDate);
  payload.startDate = parseDate(payload.startDate);

  payload.rating = parseNumber(payload.rating);
  payload.totalEarnings = parseNumber(payload.totalEarnings);
  payload.hourlyRate = parseNumber(payload.hourlyRate);

  const hoursValue = Number.parseInt(payload.totalHours, 10);
  payload.totalHours = Number.isFinite(hoursValue) ? hoursValue : undefined;

  if (!payload.freelancerResponse && payload.response) {
    payload.freelancerResponse = payload.response;
  }

  if (!payload.jobTitle && payload.projectTitle) {
    payload.jobTitle = payload.projectTitle;
  }

  const review = await Review.create(payload);
  res.json(review);
};

exports.deleteReview = async (req, res) => {
  await Review.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};