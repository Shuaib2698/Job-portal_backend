const Application = require("../models/Application");
const Job = require("../models/Job");
const User = require("../models/User");

// Apply for a job (Jobseeker only)
exports.applyForJob = async (req, res) => {
  try {
    if (req.user.role !== "jobseeker") {
      return res.status(403).json({ message: "Only job seekers can apply for jobs" });
    }

    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      job: req.params.jobId,
      applicant: req.user.id
    });
    
    if (existingApplication) {
      return res.status(400).json({ message: "You have already applied for this job" });
    }

    const application = new Application({
      job: req.params.jobId,
      applicant: req.user.id,
      contactEmail: req.user.email,
      contactPhone: req.user.phone,
      ...req.body
    });

    await application.save();
    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all applications for a jobseeker
exports.getMyApplications = async (req, res) => {
  try {
    if (req.user.role !== "jobseeker") {
      return res.status(403).json({ message: "Only job seekers can access applications" });
    }

    const applications = await Application.find({ applicant: req.user.id })
      .populate("job", "title description location salary recruiter")
      .populate({
        path: "job",
        populate: {
          path: "recruiter",
          select: "companyName"
        }
      })
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete an application (Jobseeker only)
exports.deleteApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    
    if (application.applicant.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this application" });
    }
    
    await application.remove();
    res.json({ message: "Application removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get applications for a specific job (Recruiter only)
exports.getJobApplications = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    
    if (job.recruiter.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to view these applications" });
    }
    
    const applications = await Application.find({ job: req.params.jobId })
      .populate("applicant", "name email phone skills experience education")
      .sort({ appliedAt: -1 });
    
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update application status (Recruiter only)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate("job", "recruiter");
    
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    
    if (application.job.recruiter.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to update this application" });
    }
    
    const updatedApplication = await Application.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    
    res.json(updatedApplication);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};