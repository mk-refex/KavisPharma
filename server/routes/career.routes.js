import { Router } from "express";
import { authRequired, requireCmsAccess } from "../middleware/auth.js";
import {
  getCareerContent,
  updateCareerContent,
} from "../controllers/career.controller.js";

const router = Router();

router.get("/", getCareerContent);
router.put("/", authRequired, requireCmsAccess, updateCareerContent);

export default router;
