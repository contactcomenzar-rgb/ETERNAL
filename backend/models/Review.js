const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  clientName: String,
  jobTitle: String,
  reviewLink: String,
  rating: Number,
  startDate: Date,
  endDate: {
    type: Date,
    default: null
  },
  isOngoing: {
    type: Boolean,
    default: false
  },
  freelancerResponse: String,
  totalEarnings: Number,
  hourlyRate: Number,
  totalHours: Number,

  // Legacy keys retained for old records/frontend compatibility.
  projectTitle: String,
  stars: Number,
  dateRange: String,
  review: String,
  response: String
}, { timestamps: true });

module.exports = mongoose.model("Review", reviewSchema);