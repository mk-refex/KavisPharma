import { Router } from "express";
import { authRequired } from "../middleware/auth.js";
import { getMe, login, updateProfile } from "../controllers/auth.controller.js";

const router = Router();

router.post("/login", login);
router.get("/me", authRequired, getMe);
router.patch("/me", authRequired, updateProfile);

export default router;
