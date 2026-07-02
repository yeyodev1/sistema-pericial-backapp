import { Router } from "express";
import * as comisionController from "../controllers/comision-perito.controller";
import { requireRole } from "../middlewares/role.middleware";
import { UserRole } from "../config/constants";

const router = Router();

router.get("/", requireRole(UserRole.ADMIN, UserRole.OPERATOR, UserRole.PERITO), comisionController.getAll);

export default router;
