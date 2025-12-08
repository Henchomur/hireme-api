import { Request, Response } from "express";
import Job from "../models/job.model";
import { UserRole } from "../constants/roles";
import { IUser } from "../models/user.model";
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

// @desc    Create a new Job
// @route   POST /api/jobs
// @access  Employee (Recruiter)
export const createJob = async (req: Request, res: Response) => {
  try {
    const { title, description, companyName, location, salary } = req.body;
    const job = await Job.create({
      title,
      description,
      companyName,
      location,
      salary,
      recruiterId: req.user!._id,
    });
    res.status(201).json({ status: "success", data: job });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// @desc    Get All Jobs
// @route   GET /api/jobs
// @access  Public / Authenticated
export const getAllJobs = async (req: Request, res: Response) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json({ status: "success", count: jobs.length, data: jobs });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// @desc    Get Single Job
// @route   GET /api/jobs/:id
// @access  Public / Authenticated
export const getJobById = async (req: Request, res: Response) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "recruiterId",
      "name email"
    );
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json({ status: "success", data: job });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// @desc    Update Job
// @route   PUT /api/jobs/:id
// @access  Employee (Owner) / Admin
export const updateJob = async (req: Request, res: Response) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    // Check ownership or Admin privileges
    if (
      job.recruiterId.toString() !== req.user!._id.toString() &&
      req.user!.role !== UserRole.ADMIN
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this job" });
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json({ status: "success", data: updatedJob });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// @desc    Delete Job
// @route   DELETE /api/jobs/:id
// @access  Employee (Owner) / Admin
export const deleteJob = async (req: Request, res: Response) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    // Check ownership or Admin privileges
    if (
      job.recruiterId.toString() !== req.user!._id.toString() &&
      req.user!.role !== UserRole.ADMIN
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this job" });
    }
    await job.deleteOne();
    res.json({ status: "success", message: "Job removed" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
