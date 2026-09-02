import { Router } from "express";
import { authRequired, requireAdmin } from "../middleware/auth.js";
import {
  createUser,
  deleteUser,
  listUsers,
  updateUser,
} from "../controllers/users.controller.js";

const router = Router();

router.get("/", authRequired, requireAdmin, listUsers);
router.post("/", authRequired, requireAdmin, createUser);
router.patch("/:id", authRequired, requireAdmin, updateUser);
router.delete("/:id", authRequired, requireAdmin, deleteUser);

export default router;
