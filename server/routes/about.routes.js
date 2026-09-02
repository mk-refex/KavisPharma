import { Router } from "express";
import { authRequired, requireCmsAccess } from "../middleware/auth.js";
import {
  getAboutContent,
  updateAboutContent,
} from "../controllers/about.controller.js";

const router = Router();

router.get("/", getAboutContent);
router.put("/", authRequired, requireCmsAccess, updateAboutContent);

export default router;
