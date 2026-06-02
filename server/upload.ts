import path from "path";
import crypto from "crypto";
import multer from "multer";
import { UPLOADS_DIR } from "./uploads-dir.js";

const ALLOWED_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);
const ALLOWED_VIDEO_EXT = new Set([".mp4", ".mov", ".webm"]);

export const imageUpload = multer({
  storage: multer.diskStorage({
    destination: UPLOADS_DIR,
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const safeExt = ALLOWED_EXT.has(ext) ? ext : ".jpg";
      cb(null, `${crypto.randomUUID()}${safeExt}`);
    }
  }),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("تەنها وێنە ڕێگەپێدراوە"));
    }
  }
});

export const videoUpload = multer({
  storage: multer.diskStorage({
    destination: UPLOADS_DIR,
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const safeExt = ALLOWED_VIDEO_EXT.has(ext) ? ext : ".mp4";
      cb(null, `${crypto.randomUUID()}${safeExt}`);
    }
  }),
  limits: { fileSize: 80 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("تەنها ڤیدیۆ ڕێگەپێدراوە"));
    }
  }
});
