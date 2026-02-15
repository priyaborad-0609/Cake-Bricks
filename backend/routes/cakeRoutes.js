import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import {
  getCakes,
  addCake,
  updateCake,
  deleteCake,
} from "../controllers/cake.controller.js";
import { protect } from "../middleware/authMiddleware.js";
import role from "../middleware/roleMiddleware.js";

const router = express.Router();

 // UPLOADS FOLDER
 
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

 // MULTER CONFIG
 
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files allowed"), false);
    }
    cb(null, true);
  },
});


 // ROUTES

router.get("/", getCakes);

router.post(
  "/",
  protect,
  role("ADMIN"),
  upload.single("image"),
  addCake
);

router.put(
  "/:id",
  protect,
  role("ADMIN"),
  upload.single("image"),
  updateCake
);

router.delete(
  "/:id",
  protect,
  role("ADMIN"),
  deleteCake
);

export default router;

