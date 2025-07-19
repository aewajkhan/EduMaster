import nodemailer from "nodemailer";

import dotenv from "dotenv";
dotenv.config();
export const sendReceiptEmail = async (to, name, orderDetails) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const courseList = orderDetails.courses
    .map((course) => `<li>${course.title} - ₹${course.price}</li>`)
    .join("");

  const mailOptions = {
    from: `"EduMaster" <${process.env.SMTP_USER}>`,
    to,
    subject: "Payment Receipt - EduMaster",
    html: `
      <h3>Hello ${name},</h3>
      <p>Thank you for your purchase! Here are your order details:</p>
      <ul>${courseList}</ul>
      <p><strong>Total Paid:</strong> ₹${orderDetails.totalAmount}</p>
      <p>Payment ID: ${orderDetails.paymentId}</p>
      <p>Order Date: ${new Date(orderDetails.createdAt).toLocaleString()}</p>
      <br/>
      <p>Happy Learning! 🎓</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};
