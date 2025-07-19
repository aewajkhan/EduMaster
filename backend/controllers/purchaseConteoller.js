import { CheckoutModel } from "../models/checkoutModel.js";

import PDFDocument from "pdfkit";
import { userModel } from "../models/userSchema.js";

// GET /api/v1/purchases/invoice/:orderId
export const getMyPurchases = async (req, res) => {
  try {
    // Example backend logic (Node.js + Mongoose)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const total = await CheckoutModel.countDocuments({ userId: req.user.id });
    const purchases = await CheckoutModel.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

      console.log("Fetched purchases:", purchases);
    res.status(200).json({
      success: true,
      purchases,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch purchases",
      error: err.message,
    });
  }
};

export const downloadInvoice = async (req, res) => {
  try {
    const order = await CheckoutModel.findById(req.params.orderId).populate(
      "courses.courseId"
    );
    if (!order) return res.status(404).json({ error: "Order not found" });

    const user = await userModel.findById(order.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const doc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice-${order._id}.pdf`
    );

    doc.pipe(res);

    doc.fontSize(22).text("EduMaster Invoice", { align: "center" });
    doc.moveDown();
    doc.fontSize(14).text(`Order ID: ${order._id}`);
    doc.text(`User ID: ${order.userId}`);
    doc.text(`User Name: ${user.fname} ${user.lname}`);
    doc.text(`Date: ${order.createdAt.toDateString()}`);
    doc.text(`Payment Status: ${order.paymentStatus}`);
    doc.moveDown();

    doc.fontSize(16).text("Purchased Courses:");
    order.courses.forEach((course, i) => {
      doc.fontSize(12).text(`${i + 1}. ${course.title} - ₹${course.price}`);
    });

    doc.moveDown();
    doc
      .fontSize(14)
      .text(`Total Amount: ₹${order.totalAmount}`, { align: "right" });

    doc.end();
  } catch (err) {
    res.status(500).json({ error: "Failed to generate invoice" });
  }
};

//admin view

export const getAllPurchases = async (req, res) => {
  try {
    const allPurchases = await CheckoutModel.find()
      .populate("userId", "fname email")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, purchases: allPurchases });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch purchases" });
  }
};
