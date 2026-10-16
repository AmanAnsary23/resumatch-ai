import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
     analyzeResumeController , 
     getAnalysisHistoryController, 
    } from "../controllers/analysis.controller.js";

const router = Router();

router.post("/", authenticate, analyzeResumeController);
router.get("/", authenticate, getAnalysisHistoryController);

export default router;