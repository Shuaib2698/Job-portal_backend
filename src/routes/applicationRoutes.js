const express = require("express");
const router = express.Router();
const {
  applyForJob,
  getMyApplications,
  deleteApplication,
  getJobApplications,
  updateApplicationStatus
} = require("../controllers/applicationController");
const { protect, recruiter, jobseeker } = require("../middleware/authMiddleware");

// Jobseeker routes
router.post("/jobs/:jobId/apply", protect, jobseeker, applyForJob);
router.get("/me", protect, jobseeker, getMyApplications);
router.delete("/:id", protect, jobseeker, deleteApplication);

// Recruiter routes
router.get("/jobs/:jobId/applications", protect, recruiter, getJobApplications);
router.put("/:id/status", protect, recruiter, updateApplicationStatus);

module.exports = router;