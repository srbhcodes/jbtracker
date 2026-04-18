const Job = require("../models/Job");

const getJobs = async (_req, res) => {
  const jobs = await Job.find().sort({ createdAt: -1 });
  res.status(200).json(jobs);
};

const getJobById = async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    return res.status(404).json({ message: "Job not found" });
  }

  res.status(200).json(job);
};

const createJob = async (req, res) => {
  const {
    title,
    company,
    location,
    type,
    salary,
    description,
    requirements,
    expiresAt,
    jobLevel,
    experienceLevel,
    educationLevel,
  } = req.body;

  if (!title || !company || !location || !type || !salary || !description) {
    return res.status(400).json({ message: "Please provide all required fields" });
  }

  const job = await Job.create({
    title,
    company,
    location,
    type,
    salary,
    description,
    requirements: requirements || "",
    ...(expiresAt ? { expiresAt: new Date(expiresAt) } : {}),
    jobLevel: jobLevel || "",
    experienceLevel: experienceLevel || "",
    educationLevel: educationLevel || "",
  });

  res.status(201).json(job);
};

const updateJob = async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    return res.status(404).json({ message: "Job not found" });
  }

  const body = { ...req.body };
  if (body.expiresAt === "" || body.expiresAt === null) {
    body.expiresAt = undefined;
  } else if (body.expiresAt) {
    body.expiresAt = new Date(body.expiresAt);
  }

  const updatedJob = await Job.findByIdAndUpdate(req.params.id, body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json(updatedJob);
};

const deleteJob = async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    return res.status(404).json({ message: "Job not found" });
  }

  await Job.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: "Job deleted successfully" });
};

module.exports = {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
};
