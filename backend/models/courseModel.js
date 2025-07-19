// import mongoose from "mongoose";


// const quizSchema = new mongoose.Schema({
//   question: String,
//   options: [String],
//   correctAnswer: String,
// });

// const chapterSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   videoUrl: { type: String, required: true }, // video link or path
//   duration: { type: Number }, // in minutes
//   quiz: [quizSchema], // optional quiz
// });

// const courseSchema = new mongoose.Schema(
//   {
//     title: { type: String, required: true },
//     description: { type: String, required: true },
//     image: { type: String },
//     category: { type: String },
//     price: { type: Number, required: true },
//     createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
//     chapters: [chapterSchema], // New field
//   },
//   { timestamps: true }
// );

// export const CourseModel = mongoose.model("courses", courseSchema);


// models/courseModel.js


import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correctAnswer: String,
});

const chapterSchema = new mongoose.Schema({
  title: { type: String, required: true },
  video: { type: String }, 
  quiz: [quizSchema],
});

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String },
    category: { type: String },
    price: { type: Number, required: true },
    chapters: [chapterSchema],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  },
  { timestamps: true }
);

export const CourseModel = mongoose.model("courses", courseSchema);
