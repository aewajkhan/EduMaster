import Razorpay from "razorpay";
import dotenv from "dotenv";
dotenv.config();
// console.log("KEY ID:", process.env.RAZORPAY_KEY);
// console.log("KEY SECRET:", process.env.RAZORPAY_SECRET);
export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});
