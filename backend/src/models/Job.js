const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      trim: true,
    },
    salary: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    requirements: {
      type: String,
      trim: true,
      default: "",
    },
    expiresAt: {
      type: Date,
    },
    jobLevel: {
      type: String,
      trim: true,
      default: "",
    },
    experienceLevel: {
      type: String,
      trim: true,
      default: "",
    },
    educationLevel: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
