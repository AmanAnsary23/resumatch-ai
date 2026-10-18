import prisma from "../config/prisma.js";

export const findVerificationByEmail = (email) => {
  return prisma.emailVerification.findUnique({
    where: { email },
  });
};

export const saveVerification = ({ email, otpHash, expiresAt }) => {
  return prisma.emailVerification.upsert({
    where: { email },
    update: {
      otpHash,
      expiresAt,
      attempts: 0,
      lastSentAt: new Date(),
    },
    create: {
      email,
      otpHash,
      expiresAt,
      lastSentAt: new Date(),
    },
  });
};

export const deleteVerification = (email) => {
  return prisma.emailVerification.deleteMany({
    where: { email },
  });
};

export const incrementVerificationAttempts = (email) => {
  return prisma.emailVerification.update({
    where: { email },
    data: {
      attempts: { increment: 1 },
    },
  });
};