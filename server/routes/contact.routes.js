import { Router } from "express";
import { authRequired, requireCmsAccess } from "../middleware/auth.js";
import {
  getContactContent,
  updateContactContent,
} from "../controllers/contact.controller.js";

const router = Router();

router.get("/", getContactContent);
router.put("/", authRequired, requireCmsAccess, updateContactContent);

export default router;
