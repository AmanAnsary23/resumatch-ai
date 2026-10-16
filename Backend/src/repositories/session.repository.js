import prisma from "../config/prisma.js";

export const createSession = (data) => {
  return prisma.session.create({
    data,
  });
};

export const findActiveSession = (tokenHash) => {
  return prisma.session.findFirst({
    where: {
      tokenHash,
      revokedAt: null,
      expiresAt: {
        gt: new Date(),
      },
    },
    include: {
      user: true,
    },
  });
};

export const revokeSession = (id) => {
  return prisma.session.update({
    where: { id },
    data: {
      revokedAt: new Date(),
    },
  });
};