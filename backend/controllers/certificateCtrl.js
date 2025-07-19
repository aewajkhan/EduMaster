import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";
import { Certificate } from "../models/certificateModel.js";
import { CourseModel } from "../models/courseModel.js";
import { userModel } from "../models/userSchema.js";
import { UserProgress } from "../models/progressModel.js";

const __dirname = path.resolve(); // for ES modules

// 🎓 Generate and save certificate after full progress
import { finished } from "stream/promises";

export const generateCertificate = async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId } = req.params;

    const user = await userModel.findById(userId);
    const course = await CourseModel.findById(courseId);
    const progress = await UserProgress.findOne({
      user: userId,
      course: courseId,
    });

    if (!user || !course || !progress)
      return res.status(404).json({ message: "Required data not found" });

    const totalChapters = course.chapters.length;
    const completed = progress.completedChapters.length;

    if (completed < totalChapters)
      return res.status(400).json({ message: "Course not yet 100% completed" });

    // Check if certificate already exists
    const existing = await Certificate.findOne({
      user: userId,
      course: courseId,
    });
    if (existing)
      return res.status(200).json({
        message: "Certificate already generated",
        certificate: existing,
      });

    // Ensure certificates directory exists
    const certDir = path.join(__dirname, "certificates");
    if (!fs.existsSync(certDir)) fs.mkdirSync(certDir);

    const filename = `cert-${userId}-${courseId}.pdf`;
    const filepath = path.join(certDir, filename);

    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filepath);
    doc.pipe(stream);

    // PDF Content
    doc
      .fontSize(28)
      .text("Certificate of Completion", { align: "center" })
      .moveDown(2)
      .fontSize(20)
      .text(`This is to certify that`, { align: "center" })
      .moveDown()
      .fontSize(24)
      .text(`${user.fname} ${user.lname}`, { align: "center", underline: true })
      .moveDown()
      .fontSize(18)
      .text(`has successfully completed the course`, { align: "center" })
      .moveDown()
      .fontSize(22)
      .text(`"${course.title}"`, { align: "center", italics: true })
      .moveDown(2)
      .fontSize(16)
      .text(`Date: ${new Date().toDateString()}`, { align: "right" });

    doc.end();

    // ✅ Wait for file write to finish
    await finished(stream);

    const cert = await Certificate.create({
      user: userId,
      course: courseId,
      fileUrl: `/certificates/${filename}`,
    });

    return res.status(201).json({
      message: "Certificate generated",
      certificate: cert,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Certificate generation failed", error: err.message });
  }
};

// 📥 Download certificate
export const downloadCertificate = async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId } = req.params;

    const cert = await Certificate.findOne({ user: userId, course: courseId });
    console.log("Certificate found:", cert);
    if (!cert)
      return res.status(404).json({ message: "Certificate not found" });

    const certDir = path.join(__dirname, "certificates");
    const filename = path.basename(cert.fileUrl);
    const filePath = path.join(certDir, filename);

    // Check if file exists before attempting download
    if (!fs.existsSync(filePath)) {
      return res
        .status(404)
        .json({ message: "Certificate file not found on server" });
    }

    res.download(filePath, "certificate.pdf");
  } catch (err) {
    res.status(500).json({ message: "Download failed", error: err.message });
  }
};
