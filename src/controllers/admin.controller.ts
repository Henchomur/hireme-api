import { Request, Response } from "express";
import User from "../models/user.model";
import Application from "../models/application.model";
import Job from "../models/job.model";

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select("-password");
    res.json({ status: "success", count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// @desc    Get All Jobs
// @route   GET /api/admin/jobs
// @access  Admin
export const getAllJobs = async (req: Request, res: Response) => {
  try {
    const { company } = req.query;
    const filter: any = {};
    if (company) {
      filter.companyName = { $regex: company, $options: "i" };
    }
    const jobs = await Job.find(filter).populate("recruiterId", "name email");
    res.json({ status: "success", count: jobs.length, data: jobs });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// @desc    Delete a user (and their data)
// @route   DELETE /api/admin/users/:id
// @access  Admin
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "USer not found" });

    await user.deleteOne();
    res.json({ status: "success", message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// @desc    Get System Stats (Jobs, Applications, Users)
// @route   GET /api/admin/stats
// @access  Admin
export const getSystemStats = async (req: Request, res: Response) => {
  try {
    const userCount = await User.countDocuments();
    const jobCount = await Job.countDocuments();
    const applicationCount = await Application.countDocuments();
    res.json({
      status: "success",
      data: {
        users: userCount,
        jobs: jobCount,
        applications: applicationCount,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// @desc    Get All Applications
// @route   GET /api/admin/applications
// @access  Admin
export const getAllApplications = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    const filter: any = {};
    if (status) {
      filter.status = status;
    }

    const applications = await Application.find(filter)
      .populate("applicantId", "name email")
      .populate("jobId", "title companyName")
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
