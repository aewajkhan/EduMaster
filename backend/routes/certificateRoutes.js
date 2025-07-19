import express from "express";
import { downloadCertificate, generateCertificate } from './../controllers/certificateCtrl.js';
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🎓 Generate after 100% progress
router.post("/generate/:courseId", verifyToken, generateCertificate);

// 📥 Download certificate
router.get("/download/:courseId", verifyToken, downloadCertificate);

export default router;
