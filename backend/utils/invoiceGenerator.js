import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";

export const generateInvoice = async (order, user) => {
  const doc = new PDFDocument();
  const invoicePath = path.join("invoices", `invoice-${order._id}.pdf`);

  // Ensure invoices folder exists
  if (!fs.existsSync("invoices")) fs.mkdirSync("invoices");

  const stream = fs.createWriteStream(invoicePath);
  doc.pipe(stream);

  doc.fontSize(22).text("EduMaster - Invoice", { align: "center" });
  doc.moveDown();
  doc.fontSize(14).text(`Invoice ID: ${order._id}`);
  doc.text(`Name: ${user.fname}`);
  doc.text(`Email: ${user.email}`);
  doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`);
  doc.moveDown();

  doc.fontSize(16).text("Purchased Courses:", { underline: true });

  order.courses.forEach((c, i) => {
    doc.fontSize(12).text(`${i + 1}. ${c.title} - ₹${c.price}`);
  });

  doc.moveDown();
  doc.fontSize(14).text(`Total Amount: ₹${order.totalAmount}`, { bold: true });

  doc.end();

  return invoicePath;
};
