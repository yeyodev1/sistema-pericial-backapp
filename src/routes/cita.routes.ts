import { Router } from "express";
import * as citaController from "../controllers/cita.controller";
import { requireRole } from "../middlewares/role.middleware";
import { UserRole } from "../config/constants";

const router = Router();

router.get("/", requireRole(UserRole.ADMIN, UserRole.OPERATOR, UserRole.PERITO, UserRole.COLLECTOR), citaController.getAll);
router.get("/stats", requireRole(UserRole.ADMIN, UserRole.OPERATOR, UserRole.PERITO, UserRole.COLLECTOR), citaController.getStats);
router.get("/:id", requireRole(UserRole.ADMIN, UserRole.OPERATOR, UserRole.PERITO, UserRole.COLLECTOR), citaController.getById);
router.post("/", requireRole(UserRole.ADMIN, UserRole.OPERATOR), citaController.create);
router.put("/:id", requireRole(UserRole.ADMIN, UserRole.OPERATOR), citaController.update);
router.delete("/:id", requireRole(UserRole.ADMIN), citaController.remove);

export default router;
