import express from "express";
import {
  sendRegisterOtp,
  verifyRegisterOtp,
  sendLoginOtp,
  verifyLoginOtp,
  forgotPassword,
  resetPassword
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register/send-otp", sendRegisterOtp);
router.post("/register/verify-otp", verifyRegisterOtp);

router.post("/login/send-otp", sendLoginOtp);
router.post("/login/verify-otp", verifyLoginOtp);

router.post("/forgot-password/send-otp", forgotPassword);
router.post("/forgot-password/reset-password", resetPassword);

export default router;