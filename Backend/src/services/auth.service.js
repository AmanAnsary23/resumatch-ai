import bcrypt from "bcryptjs";

import {
  findUserByEmail,
  findUserByEmailForLogin,
  createUser,
} from "../repositories/user.repository.js";

import { createTokens } from "./token.service.js";

export const registerUser = async ({ name, email, password }) => {
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    const error = new Error("Email is already registered");
    error.statusCode = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await createUser({
    name,
    email,
    passwordHash,
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
};

export const loginUser = async ({ email, password }) => {
  const user = await findUserByEmailForLogin(email);

  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const tokens = await createTokens(user);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    ...tokens,
  };
};
