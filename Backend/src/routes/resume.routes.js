import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { uploadResume } from "../middlewares/upload.middleware.js";
import { 
  uploadResumeController , 
  getResumesController,
  deleteResumeController,
  downloadResumeController
} from "../controllers/resume.controller.js";

const router = Router();

router.post(
  "/",
  authenticate,
  uploadResume.single("resume"),
  uploadResumeController
);

router.get("/", authenticate, getResumesController);
router.delete("/:resumeId", authenticate, deleteResumeController);
router.get("/:resumeId/download", authenticate, downloadResumeController);

export default router;``