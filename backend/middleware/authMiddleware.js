import jwt from "jsonwebtoken";
import User from "../models/User.js";

// PROTECT (USER + ADMIN)

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        message: "Not authorized, please login",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    if (user.blocked) {
      return res.status(403).json({
        message: "Account blocked by admin",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Not authorized, token invalid or expired",
    });
  }
};

// ADMIN ONLY

export const adminOnly = (req, res, next) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({
      message: "Admin access only",
    });
  }
  next();
};
