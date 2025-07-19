import crypto from "crypto";
import { instance } from "../config/razorpay.js";
import { CheckoutModel } from "../models/checkoutModel.js";
import { CartModel } from "./../models/cartModel.js";
import { sendReceiptEmail } from "../utils/sendEmail.js";
import { userModel } from "./../models/userSchema.js";

export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res
        .status(400)
        .json({ success: false, message: "Amount required" });
    }

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await instance.orders.create(options);
    return res.status(200).json({ success: true, order });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Order creation failed",
      error: err.message,
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, cart } =
      req.body;

    const userId = req.user.id;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !cart?.length
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid payment data" });
    }

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid signature" });
    }

    const totalAmount = cart.reduce((acc, item) => acc + item.price, 0);

    // Save order in DB

    // After saving to CheckoutModel
    const order = await CheckoutModel.create({
      userId,
      courses: cart.map(({ courseId, title, price }) => ({
        courseId,
        title,
        price,
      })),
      totalAmount,
      paymentStatus: "paid",
      paymentId: razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    });

    // Get user email and name
    const user = await userModel.findById(userId);
    // console.log("User found:", user);

    if (user) {
      await sendReceiptEmail(user.email, user.fname, order);
    }

    await CartModel.findOneAndUpdate({ userId }, { $set: { courses: [] } });

    return res
      .status(200)
      .json({ success: true, message: "Payment verified and order placed" });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Verification failed",
      error: err.message,
    });
  }
};
