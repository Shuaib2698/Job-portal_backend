const express = require("express");
const router = express.Router();
const {
  postJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  getRecruiterJobs
} = require("../controllers/jobController");
const { protect, recruiter } = require("../middleware/authMiddleware");

// Public routes
router.get("/", getJobs);
router.get("/:id", getJobById);

// Protected recruiter routes
router.post("/", protect, recruiter, postJob);
router.put("/:id", protect, recruiter, updateJob);
router.delete("/:id", protect, recruiter, deleteJob);
router.get("/recruiter/me", protect, recruiter, getRecruiterJobs);

module.exports = router;