import express from "express";
import {
  getDashboardStats,
  getAllUsers,
  getAllOrders,
  getTopCakes,
  updateOrderStatus,
  toggleBlockUser, 
} from "../controllers/admin.controller.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

 // ADMIN DASHBOARD
 
router.get("/dashboard", protect, adminOnly, getDashboardStats);

 // ALL USERS (ADMIN)
 
router.get("/users", protect, adminOnly, getAllUsers);

 // BLOCK / UNBLOCK USER (ADMIN)
 
router.put("/users/:id/block", protect, adminOnly, toggleBlockUser);

 // ALL ORDERS (ADMIN)
 
router.get("/orders", protect, adminOnly, getAllOrders);

 // UPDATE ORDER STATUS (ADMIN)
 
router.put("/orders/:id/status", protect, adminOnly, updateOrderStatus);

 // TOP SELLING CAKES (ADMIN)
 
router.get("/top-cakes", protect, adminOnly, getTopCakes);

export default router;
