const Job = require("../models/Job");

// Post a new job (Recruiter only)
exports.postJob = async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({ message: "Only recruiters can post jobs" });
    }

    const job = new Job({
      ...req.body,
      recruiter: req.user.id
    });

    await job.save();
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all jobs
exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ status: "active" })
      .populate("recruiter", "name companyName")
      .sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get job by ID
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate("recruiter", "name companyName email");
    
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update job (Recruiter only)
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    
    if (job.recruiter.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to update this job" });
    }
    
    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      { $set: req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    res.json(updatedJob);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete job (Recruiter or Admin)
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    
    if (job.recruiter.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this job" });
    }
    
    await job.remove();
    res.json({ message: "Job removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get jobs posted by recruiter
exports.getRecruiterJobs = async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({ message: "Only recruiters can access this" });
    }
    
    const jobs = await Job.find({ recruiter: req.user.id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};