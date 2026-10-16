import prisma from "../config/prisma.js";

export const createAnalysis = async (data) => {
    return prisma.analysis.create({
        data,
    });
};

export const findAnalysesByUser = async (userId) => {
  return prisma.analysis.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      resumeId: true,
      jobDescription: true,
      matchScore: true,
      result: true,
      createdAt: true,
      resume: {
        select: {
          fileName: true,
        },
      },
    },
  });
};