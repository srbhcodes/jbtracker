const express = require("express");
const {
  getJobs,
  getMyJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
} = require("../controllers/jobController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/mine", protect, getMyJobs);
router.route("/").get(getJobs).post(protect, createJob);
router.route("/:id").get(getJobById).put(protect, updateJob).delete(protect, deleteJob);

module.exports = router;
