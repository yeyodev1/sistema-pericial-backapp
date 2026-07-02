import { Router } from "express";
import * as rutaCobroController from "../controllers/ruta-cobro.controller";
import { requireRole } from "../middlewares/role.middleware";
import { UserRole } from "../config/constants";

const router = Router();

router.get("/", requireRole(UserRole.ADMIN, UserRole.OPERATOR, UserRole.PERITO, UserRole.COLLECTOR), rutaCobroController.getAll);

export default router;
