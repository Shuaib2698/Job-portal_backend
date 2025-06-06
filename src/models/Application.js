const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  applicant: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected', 'hold'], default: 'pending' },
  appliedAt: { type: Date, default: Date.now },
  recruiterMessage: { type: String },
  contactEmail: { type: String },
  contactPhone: { type: String },
  resume: { type: String } // URL to resume file
});

module.exports = mongoose.model("Application", applicationSchema);