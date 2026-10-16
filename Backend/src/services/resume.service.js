import fs from "node:fs/promises";
import { PDFParse } from "pdf-parse";
import {
  createResume,
  updateResumeText,
} from "../repositories/resume.repository.js";

export const saveResume = async (userId, file) => {
  const resume = await createResume({
    userId,
    fileName: file.originalname,
    storagePath: file.path,
  });

  const buffer = await fs.readFile(file.path);
  const parser = new PDFParse({ data: buffer });

  try {
    const result = await parser.getText();
    const extractedText = result.text.trim();

    if (!extractedText) {
      throw new Error("No text found in PDF. It may be a scanned document.");
    }

    return await updateResumeText(resume.id, extractedText);
  } finally {
    await parser.destroy();
  }
};