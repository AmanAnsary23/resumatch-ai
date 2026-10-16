import { findResumeByUser } from "../repositories/resume.repository.js";
import { createAnalysis } from "../repositories/analysis.repository.js";
import { analyzeResumeWithAI } from "../services/groq-analysis.service.js";
import { findAnalysesByUser } from "../repositories/analysis.repository.js";


export const analyzeResumeController = async (req, res, next) => {
  try {
    const { resumeId, jobDescription } = req.body;

    if (
      !resumeId ||
      typeof jobDescription !== "string" ||
      !jobDescription.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Resume ID and job description are required.",
      });
    }

    if (jobDescription.length > 20000) {
      return res.status(400).json({
        success: false,
        message: "Job description must not exceed 20,000 characters.",
      });
    }

    const resume = await findResumeByUser(resumeId, req.user.id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found.",
      });
    }

    if (!resume.extractedText?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Resume text is not available for analysis.",
      });
    }

    const result = await analyzeResumeWithAI(
      resume.extractedText,
      jobDescription.trim()
    );

    const analysis = await createAnalysis({
      userId: req.user.id,
      resumeId: resume.id,
      jobDescription: jobDescription.trim(),
      matchScore: result.matchScore,
      result,
    });

    return res.status(201).json({
      success: true,
      message: "AI resume analysis completed successfully.",
      data: {
        analysisId: analysis.id,
        resumeId: resume.id,
        ...result,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAnalysisHistoryController = async (req, res, next) => {
  try {
    const analyses = await findAnalysesByUser(req.user.id);

    return res.status(200).json({
      success: true,
      count: analyses.length,
      data: analyses,
    });
  } catch (error) {
    next(error);
  }
};