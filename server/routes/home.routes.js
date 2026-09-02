import { Router } from "express";
import { authRequired, requireCmsAccess } from "../middleware/auth.js";
import {
  getHomeContent,
  updateHomeContent,
} from "../controllers/home.controller.js";

const router = Router();

router.get("/", getHomeContent);
router.put("/", authRequired, requireCmsAccess, updateHomeContent);

export default router;
