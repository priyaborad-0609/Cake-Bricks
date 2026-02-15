import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  placeOrder,
  myOrders,
  cancelOrder,
} from "../controllers/order.controller.js";

const router = express.Router();

router.post("/", protect, placeOrder);
router.get("/me", protect, myOrders);
router.put("/cancel/:id", protect, cancelOrder);

export default router;
