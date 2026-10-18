
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import resumeRoutes from "./routes/resume.routes.js";
import analysisRoutes from "./routes/analysis.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

// CORS configuration
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://resumatch-ai-two-kappa.vercel.app",
    ],
    credentials: true,
  })
);

// Request middleware
app.use(express.json());
app.use(cookieParser());

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ResuMatch API is running",
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/analyses", analysisRoutes);

// Error handler must come after routes
app.use(errorHandler);

export default app;
