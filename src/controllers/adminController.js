const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");

// Admin dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can access this" });
    }

    const usersCount = await User.countDocuments();
    const jobsCount = await Job.countDocuments();
    const applicationsCount = await Application.countDocuments();
    const recruitersCount = await User.countDocuments({ role: "recruiter" });
    const jobSeekersCount = await User.countDocuments({ role: "jobseeker" });

    res.json({
      usersCount,
      jobsCount,
      applicationsCount,
      recruitersCount,
      jobSeekersCount
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can access this" });
    }

    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can access this" });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.remove();
    res.json({ message: "User removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all jobs (admin view)
exports.getAllJobs = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can access this" });
    }

    const jobs = await Job.find()
      .populate("recruiter", "name companyName email")
      .sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all applications (admin view)
exports.getAllApplications = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can access this" });
    }

    const applications = await Application.find()
      .populate("job", "title description")
      .populate("applicant", "name email")
      .sort({ appliedAt: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};