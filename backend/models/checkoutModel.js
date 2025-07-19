// import mongoose from "mongoose";

// const checkoutSchema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "users",
//       required: true,
//     },
//     courses: [
//       {
//         courseId: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "courses",
//           required: true,
//         },
//         title: { type: String, required: true },
//         price: { type: Number, required: true },
//       },
//     ],
//     totalAmount: { type: Number, required: true },
//     paymentStatus: {
//       type: String,
//       enum: ["pending", "paid", "failed"],
//       default: "pending",
//     },
//     paymentId: { type: String },
//     razorpay_order_id: { type: String },
//     razorpay_signature: { type: String },
//   },
//   { timestamps: true }
// );

// export const CheckoutModel = mongoose.model("Checkout", checkoutSchema);

import mongoose from "mongoose";

const checkoutSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    courses: [
      {
        courseId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "courses",
          required: true,
        },
        title: String,
        price: Number,
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    paymentId: String,
    razorpay_order_id: String,
    razorpay_signature: String,
  },
  { timestamps: true }
);

export const CheckoutModel = mongoose.model("Checkout", checkoutSchema);
