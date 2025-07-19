import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    role: { type: String, default: "user" },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImage: { type: String },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const userModel = mongoose.model("users", userSchema);
