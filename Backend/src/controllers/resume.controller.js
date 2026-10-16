import { saveResume } from "../services/resume.service.js";
import { findResumesByUser ,
        deleteResumeByUser,
        findResumeByUser
} from "../repositories/resume.repository.js";
import path from "node:path";
import fs from "node:fs/promises";

export const uploadResumeController = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a PDF resume",
      });
    }

    const resume = await saveResume(req.user.id, req.file);

    return res.status(201).json({
      success: true,
      message: "Resume uploaded successfully",
      resume,
    });
  } catch (error) {
    next(error);
  }
};

export const getResumesController = async (req, res, next) => {
  try {
    const resumes = await findResumesByUser(req.user.id);

    return res.status(200).json({
      success: true,
      count: resumes.length,
      data: resumes,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteResumeController = async (req, res, next) => {
  try {
    const { resumeId } = req.params;

    const resume = await findResumeByUser(resumeId, req.user.id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found.",
      });
    }

    const uploadDirectory = path.resolve("uploads/resumes");
    const filePath = path.resolve(resume.storagePath);

    if (!filePath.startsWith(uploadDirectory + path.sep)) {
      return res.status(500).json({
        success: false,
        message: "Invalid resume storage path.",
      });
    }

    await deleteResumeByUser(resume.id, req.user.id);

    try {
      await fs.unlink(filePath);
    } catch (error) {
      if (error.code !== "ENOENT") {
        console.error("Resume file cleanup failed:", error);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Resume deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

export const downloadResumeController = async (req, res, next) => {
  try {
    const { resumeId } = req.params;
    const resume = await findResumeByUser(resumeId, req.user.id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found.",
      });
    }

    const uploadDirectory = path.resolve("uploads/resumes");
    const filePath = path.resolve(resume.storagePath);

    if (!filePath.startsWith(uploadDirectory + path.sep)) {
      return res.status(500).json({
        success: false,
        message: "Invalid resume storage path.",
      });
    }

    await fs.access(filePath);

    return res.download(
      filePath,
      path.basename(resume.originalName || filePath),
      (error) => {
        if (error) {
          if (!res.headersSent) {
            next(error);
          }
        }
      }
    );
  } catch (error) {
    if (error.code === "ENOENT") {
      return res.status(404).json({
        success: false,
        message: "Resume file not found on the server.",
      });
    }

    next(error);
  }
};
