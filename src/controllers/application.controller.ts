import { Request, Response } from "express";
import Application from "../models/application.model";
import Job from "../models/job.model";
import { UserRole, ApplicationStatus } from "../constants/roles";
import { Types } from "mongoose";

// @desc    Apply for a job (Upload CV + Mock Payment)
// @route   POST /api/applications/:jobId
// @access  Job Seeker
export const applyForJob = async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;
    if (!req.file) {
      return res.status(400).json({ message: "Please upload your CV/Resume" });
    }
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    const existingApplication = await Application.findOne({
      jobId: new Types.ObjectId(jobId),
      applicantId: req.user!._id,
    });
    if (existingApplication) {
      return res
        .status(400)
        .json({ message: "You have already applied for this job" });
    }

    const mockPayment = {
      amount: 100, // 100 Taka
      transactionId: `TXN_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      status: "PAID" as "PAID", // Explicitly casting to literal type
      date: new Date(),
    };

    const application = await Application.create({
      jobId: new Types.ObjectId(jobId),
      applicantId: req.user!._id,
      resumeUrl: req.file.path,
      payment: mockPayment,
    });
    res.status(201).json({
      status: "success",
      message:
        "Application submitted successfully. Payment of 100 Taka received",
      data: application,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// @desc    Get applications for a specific job (For Recruiters)
// @route   GET /api/applications/job/:jobId
// @access  Employee
export const getJobApplications = async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;

    // Check if job belongs to this recruiter
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (job.recruiterId.toString() !== req.user!._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to view these applications" });
    }
    const applications = await Application.find({
      jobId: new Types.ObjectId(jobId),
    })
      .populate("applicantId", "name email")
      .sort({ createdAt: -1 });
    res.json({
      status: "success",
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// @desc    Get my application history
// @route   GET /api/applications/my-history
// @access  Job Seeker
export const getMyApplications = async (req: Request, res: Response) => {
  try {
    const applications = await Application.find({
      applicantId: req.user!._id,
    })
      .populate("jobId", "title companyName location")
      .sort({ createdAt: -1 });
    res.json({
      status: "success",
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// @desc    Update Application Status (Accept/Reject)
// @route   PATCH /api/applications/:id/status
// @access  Employee
export const updateApplicationStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body; // PENDING, ACCEPTED, REJECTED

    // Validate Status
    if (!Object.values(ApplicationStatus).includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const application = await Application.findById(req.params.id).populate(
      "jobId"
    );
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    const job: any = application.jobId;
    if (job.recruiterId.toString() !== req.user!._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    application.status = status;
    await application.save();
    res.json({ status: "success", data: application });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
