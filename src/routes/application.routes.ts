import express from "express";
import { protect, restrictTo } from "../middlewares/auth.middleware";
import { UserRole } from "../constants/roles";
import { upload } from "../middlewares/upload.middleware";
import {
  applyForJob,
  getJobApplications,
  getMyApplications,
  updateApplicationStatus,
} from "../controllers/application.controller";

const router = express.Router();
router.use(protect);

// Job Seeker: Apply
router.post(
  "/:jobId",
  restrictTo(UserRole.JOB_SEEKER),
  upload.single("resume"),
  applyForJob
);
// Job Seeker: View History
router.get("/my-history", restrictTo(UserRole.JOB_SEEKER), getMyApplications);
// Recruiter: View Applications for a Job
router.get("/job/:jobId", restrictTo(UserRole.EMPLOYEE), getJobApplications);
// Recruiter: Accept/Reject
router.patch(
  "/:id/status",
  restrictTo(UserRole.EMPLOYEE),
  updateApplicationStatus
);
export default router;
