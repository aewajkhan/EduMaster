import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  completeChapter,
  getCourseChapters,
} from "../controllers/courseProgressCTRL.js";

const router = express.Router();

router.get("/:courseId/chapters", verifyToken, getCourseChapters);
router.post("/:courseId/complete", verifyToken, completeChapter);
// router.post("/:courseId/complete", verifyToken, completeChapter);


export default router;
