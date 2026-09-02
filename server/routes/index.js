import { Router } from "express";
import authRoutes from "./auth.routes.js";
import homeRoutes from "./home.routes.js";
import aboutRoutes from "./about.routes.js";
import careerRoutes from "./career.routes.js";
import contactRoutes from "./contact.routes.js";
import uploadRoutes from "./upload.routes.js";
import usersRoutes from "./users.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/home", homeRoutes);
router.use("/about", aboutRoutes);
router.use("/career", careerRoutes);
router.use("/contact", contactRoutes);
router.use("/upload", uploadRoutes);

export default router;
