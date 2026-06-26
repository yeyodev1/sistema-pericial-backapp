import express from "express";
import { z } from "zod";
import {
  loginController,
  getCurrentUserController,
  updateProfileController,
  updatePasswordController,
} from "../controllers/auth.controller";
import { validateSchema } from "../middlewares/validate.middleware";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

router.post("/login", validateSchema(loginSchema), loginController);
router.get("/me", authMiddleware, getCurrentUserController);
router.put("/profile", authMiddleware, updateProfileController);
router.put("/password", authMiddleware, updatePasswordController);

export default router;
