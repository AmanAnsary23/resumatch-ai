import { Router } from "express";
import {
  registerSchema,
  loginSchema,
  verifyOtpSchema,
  resendOtpSchema,
} from "../validators/auth.validator.js";
import { login , verifyOtp, resendOtp , register } from "../controllers/auth.controller.js";
import {
  refresh,
  logout,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", (req, res, next) => {
  const result = registerSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      errors: result.error.issues,
    });
  }

  req.body = result.data;
  return register(req, res, next);
});

router.post("/login", (req, res, next) => {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      errors: result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  req.body = result.data;
  return login(req, res, next);
});

router.post("/refresh", refresh);
router.post("/logout", logout);

router.get("/me", authenticate, (req, res) => {
  return res.json({
    success: true,
    user: req.user,
  });
});

router.post("/verify-otp", (req, res, next) => {
  const result = verifyOtpSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      errors: result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  req.body = result.data;
  return verifyOtp(req, res, next);
});

router.post("/resend-otp", (req, res, next) => {
  const result = resendOtpSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      errors: result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  req.body = result.data;
  return resendOtp(req, res, next);
});

export default router;