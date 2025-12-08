import express, { Application, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";

// Import Routes
import authRoutes from "./routes/auth.routes";
import jobRoutes from "./routes/job.routes";
import applicationRoutes from "./routes/application.routes";
import adminRoutes from "./routes/admin.routes";

const app: Application = express();

//Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Static Folder (for accessing uploaded CVs)
// Access via: http://localhost:5000/uploads/resumes/filename.pdf
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/admin", adminRoutes);

// Health Check
app.get("/", (req: Request, res: Response) => {
  res.send("HireMe API is running successfully 🚀");
});

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

export default app;
