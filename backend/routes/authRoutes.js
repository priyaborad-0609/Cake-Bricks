import express from "express";
import {
  signup,
  verifyOtp,
  signin,
  logout,
  forgotPassword,
  verifyOtpReset,
  changePasswordReset,
  changePassword,
} from "../controllers/auth.controller.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Auth routes
router.post("/signup", signup);
router.post("/verify-otp", verifyOtp);
router.post("/signin", signin);
router.post("/logout", logout);

// Forgot password (OTP flow)
router.post("/forgot-password", forgotPassword);          
router.post("/verify-otp-reset", verifyOtpReset);        
router.post("/change-password-reset", changePasswordReset); 

// Normal change password (user logged in)
router.post("/change-password", protect, changePassword);

export default router;
