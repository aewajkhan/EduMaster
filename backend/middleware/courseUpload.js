import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure uploads directory exists
const dir = 'uploads/courses';
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, dir),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  },
});

export const courseImageUpload = multer({ storage });
