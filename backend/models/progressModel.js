import mongoose from "mongoose";

const userProgressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "courses",
    required: true,
  },
  completedChapters: [{ type: mongoose.Schema.Types.ObjectId }],
  quizResults: [
    {
      chapterId: { type: mongoose.Schema.Types.ObjectId },
      score: Number,
      total: Number,
      passed: Boolean,
    },
  ],
  completedAt: Date, // set when course is 100% complete
});

export const UserProgress = mongoose.model("userProgress", userProgressSchema);
