import { Router } from "express";
import {
  login,
  signup,
  verifyEmail,
  resendVerification,
  forgetPassword,
  resetPassword,
} from "./auth.service.js";
import {
  forgotPasswordValidate,
  loginValidate,
  resendVerificationValidate,
  resetPasswordValidate,
  signupValidate,
} from "./auth.validate.js";
import { validateInput } from "../../common/utils/validate.js";
import { upload } from "../../common/middleware/multer.js";
import { auth } from "../../common/middleware/auth.js";

const router = Router();

router.post(
  "/auth/signup",
  validateInput(signupValidate),
  upload().single("image"),
  signup,
);
router.post("/auth/login", validateInput(loginValidate), login);
router.get("/auth/verify-email/:token", verifyEmail);
router.post(
  "/auth/resend-verification",
  validateInput(resendVerificationValidate),
  resendVerification,
);
router.post(
  "/auth/forget-password",
  validateInput(forgotPasswordValidate),
  forgetPassword,
);
router.post(
  "/auth/reset-password",
  auth,
  validateInput(resetPasswordValidate),
  resetPassword,
);
export default router;
