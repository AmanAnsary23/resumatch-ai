import jwt from "jsonwebtoken";
import { randomBytes, createHash } from "node:crypto";
import {
  createSession,
  findActiveSession,
  revokeSession,
} from "../repositories/session.repository.js";

const hashToken = (token) =>
  createHash("sha256").update(token).digest("hex");

const generateAccessToken = (user) => {
  const secret = process.env.JWT_ACCESS_SECRET;

  if (!secret) {
    throw new Error("JWT_ACCESS_SECRET is not configured");
  }

  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
    },
    secret,
    { expiresIn: "15m" }
  );
};

export const createTokens = async (user) => {
  const accessToken = generateAccessToken(user);
  const refreshToken = randomBytes(32).toString("hex");

  const ttl = Number(process.env.SESSION_TTL_SECONDS || 604800);

  await createSession({
    tokenHash: hashToken(refreshToken),
    userId: user.id,
    expiresAt: new Date(Date.now() + ttl * 1000),
  });

  return {
    accessToken,
    refreshToken,
  };
};

export const refreshAccessToken = async (refreshToken) => {
  const session = await findActiveSession(hashToken(refreshToken));

  if (!session) {
    const error = new Error("Invalid or expired session");
    error.statusCode = 401;
    throw error;
  }

  const newTokens = await createTokens(session.user);

  await revokeSession(session.id);

  return newTokens;
};

export const logoutSession = async (refreshToken) => {
  if (!refreshToken) return;

  const session = await findActiveSession(hashToken(refreshToken));

  if (session) {
    await revokeSession(session.id);
  }
};