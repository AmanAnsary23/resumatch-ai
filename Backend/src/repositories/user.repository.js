
import prisma from "../config/prisma.js";

export const findUserByEmail = (email) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

export const createUser = ({ name, email, passwordHash }) => {
  return prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
    },
  });
};

export const findUserByEmailForLogin = (email) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

export const findUserById = (id) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
};

export const markEmailAsVerified = (email) => {
  return prisma.user.update({
    where: { email },
    data: { isEmailVerified: true },
  });
};