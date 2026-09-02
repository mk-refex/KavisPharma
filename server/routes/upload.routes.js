import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { authRequired, requireCmsAccess } from "../middleware/auth.js";
import { Router } from "express";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, "../uploads/images");

fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || ".jpg";
    const safeExt = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"].includes(ext)
      ? ext
      : ".jpg";
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${safeExt}`;
    cb(null, name);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Only image files are allowed"));
      return;
    }
    cb(null, true);
  },
});

const router = Router();

router.post(
  "/",
  authRequired,
  requireCmsAccess,
  (req, res) => {
    upload.single("image")(req, res, (err) => {
      if (err) {
        return res.status(400).json({ message: err.message || "Upload failed" });
      }
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }
      const url = `/uploads/images/${req.file.filename}`;
      return res.json({
        message: "Image uploaded successfully",
        url,
        filename: req.file.filename,
      });
    });
  },
);

export default router;
