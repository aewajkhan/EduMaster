import { Certificate } from "../models/certificateModel.js";
import { CourseModel } from "../models/courseModel.js";
import { UserProgress } from "../models/progressModel.js";

import path from "path";
import { fileURLToPath } from "url";
// GET course chapters and user progress
// // GET chapters + user progress
// export const getCourseChapters = async (req, res) => {
//   const userId = req.user.id;
//   const { courseId } = req.params;
//   console.log("Fetching course chapters for user:", userId, "Course ID:", courseId);

//   try {
//     const course = await CourseModel.findById(courseId);
//     console.log("Course found:", course);

//     if (!course) {
//       return res.status(404).json({ message: "Course not found" });
//     }

//     const progress = await UserProgress.findOne({
//       user: userId,
//       course: courseId,
//     });

//     res.json({
//       course: {
//         title: course.title,
//         chapters: course.chapters,
//       },
//       completedChapters: progress?.completedChapters || [],
//     });
//   } catch (err) {
//     res.status(500).json({
//       message: "Something went wrong",
//       error: err.message,
//     });
//   }
// };
export const getCourseChapters = async (req, res) => {
  const userId = req.user.id;
  const { courseId } = req.params;

  try {
    const course = await CourseModel.findById(courseId);
    console.log(course, "Course found in getCourseChapters");
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    const progress = await UserProgress.findOne({
      user: userId,
      course: courseId,
    });

    res.json({
      course: {
        title: course.title,
        chapters: course.chapters,
      },
      completedChapters: progress?.completedChapters || [],
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
  }
};

// POST: mark chapter as completed

export const completeChapter = async (req, res) => {
  const userId = req.user.id;
  const { courseId } = req.params;
  const { chapterId } = req.body;

  try {
    const course = await CourseModel.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    let progress = await UserProgress.findOne({
      user: userId,
      course: courseId,
    });

    if (!progress) {
      progress = await UserProgress.create({
        user: userId,
        course: courseId,
        completedChapters: [chapterId],
      });
    } else if (!progress.completedChapters.includes(chapterId)) {
      progress.completedChapters.push(chapterId);
      await progress.save();
    }

    // Certificate logic
    if (
      course.chapters.length === progress.completedChapters.length &&
      !progress.completedAt
    ) {
      progress.completedAt = new Date();
      await progress.save();
    }

    res.json({
      message: "Chapter marked as complete",
      completedChapters: progress.completedChapters,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update progress", error: err.message });
  }
};
