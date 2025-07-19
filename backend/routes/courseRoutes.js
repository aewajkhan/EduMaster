import express from "express";
import {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../controllers/courseController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { courseImageUpload } from "../middleware/courseUpload.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router = express.Router();

router.get("/", getAllCourses);
router.get("/:id", getCourseById);
router.post(
  "/create",
  verifyToken,
  isAdmin,
  courseImageUpload.single("image"),
  createCourse
);

router.put(
  "/update/:id",
  verifyToken,
  isAdmin,
  courseImageUpload.single("image"),
  updateCourse
);
router.delete("/delete/:id", verifyToken, isAdmin, deleteCourse);

export default router;
