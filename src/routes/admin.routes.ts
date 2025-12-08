import express from "express";
import { protect, restrictTo } from "../middlewares/auth.middleware";
import { UserRole } from "../constants/roles";
import {
  deleteUser,
  getAllApplications,
  getAllUsers,
  getSystemStats,
} from "../controllers/admin.controller";

const router = express.Router();
router.use(protect, restrictTo(UserRole.ADMIN));

router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);
router.get("/stats", getSystemStats);
router.get("/applications", getAllApplications);

export default router;
