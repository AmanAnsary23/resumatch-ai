import prisma from "../config/prisma.js";

export const createResume = (data) => {
    return prisma.resume.create({
        data,
    });
};

export const updateResumeText = (id, extractedText) => {
  return prisma.resume.update({
    where: { id },
    data: { extractedText },
  });
};

export const findResumeByUser = async (resumeId, userId) => {
  return prisma.resume.findFirst({
    where: {
      id: resumeId,
      userId,
    },
  });
};

export const findResumesByUser = async (userId) => {
  return prisma.resume.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      fileName: true,
      createdAt: true,
    },
  });
};

export const deleteResumeByUser = async (resumeId, userId) => {
  return prisma.resume.deleteMany({
    where: {
      id: resumeId,
      userId,
    },
  });
};