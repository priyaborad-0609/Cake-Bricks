import bcrypt from "bcrypt";
import User from "../models/User.js";
import Otp from "../models/Otp.js";
import { generateOtp } from "../utils/generateOtp.js";
import sendEmail from "../utils/sendEmail.js";
import { createToken } from "../utils/token.js";

// SIGNUP

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      role: "USER",
      isVerified: false,
    });

    const otp = generateOtp();
    await Otp.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    sendEmail(email, "Verify your OTP", `Your OTP is ${otp}`)
      .catch(err => console.error("OTP email failed:", err.message));

    res.status(201).json({
      success: true,
      message: "Signup successful. OTP sent to email.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// VERIFY OTP

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return res.status(400).json({ message: "Email & OTP required" });

    const record = await Otp.findOne({ email, otp });
    if (!record) return res.status(400).json({ message: "Invalid OTP" });
    if (record.expiresAt < new Date())
      return res.status(400).json({ message: "OTP expired" });

    await User.updateOne({ email }, { isVerified: true });
    await Otp.deleteMany({ email });

    const user = await User.findOne({ email });
    const token = createToken(user);

    res.cookie("token", token, { httpOnly: true, sameSite: "lax" });
    res.json({ success: true, message: "Account verified successfully", role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// SIGNIN / LOGOUT

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email & password required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    if (!user.isVerified) return res.status(400).json({ message: "Please verify your account using OTP" });
    if (user.blocked) return res.status(403).json({ message: "Account is blocked by admin" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = createToken(user);
    res.cookie("token", token, { httpOnly: true, sameSite: "lax" });
    res.json({ success: true, message: "Login successful", role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ success: true, message: "Logged out successfully" });
};

// FORGOT PASSWORD (OTP FLOW)

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await Otp.create({ email, otp, expiresAt });
    sendEmail(email, "Reset Password OTP", `Your OTP is ${otp}`).catch(err =>
      console.error("OTP email failed:", err.message)
    );

    res.json({ success: true, message: "OTP sent to your email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// VERIFY OTP FOR PASSWORD RESET

export const verifyOtpReset = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: "Email & OTP required" });

    const record = await Otp.findOne({ email, otp });
    if (!record) return res.status(400).json({ message: "Invalid OTP" });
    if (record.expiresAt < new Date()) return res.status(400).json({ message: "OTP expired" });

    res.json({ success: true, message: "OTP verified" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// CHANGE PASSWORD AFTER OTP

export const changePasswordReset = async (req, res) => {
  try {
    const { email, otp, password } = req.body;
    if (!email || !otp || !password)
      return res.status(400).json({ message: "Email, OTP & password required" });

    const record = await Otp.findOne({ email, otp });
    if (!record) return res.status(400).json({ message: "Invalid OTP" });
    if (record.expiresAt < new Date()) return res.status(400).json({ message: "OTP expired" });

    const user = await User.findOne({ email });
    user.password = await bcrypt.hash(password, 10);
    await user.save();

    await Otp.deleteMany({ email });

    res.json({ success: true, message: "Password changed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// CHANGE PASSWORD (LOGGED-IN USER)

export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword)
      return res.status(400).json({ message: "Old & new password required" });

    const user = await User.findById(req.user.id);
    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) return res.status(400).json({ message: "Old password incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ success: true, message: "Password changed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

