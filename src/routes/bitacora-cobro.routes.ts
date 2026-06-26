import { Router } from "express";
import * as bitacoraController from "../controllers/bitacora-cobro.controller";
import { requireRole } from "../middlewares/role.middleware";
import { UserRole } from "../config/constants";

const router = Router();

router.get("/", requireRole(UserRole.ADMIN, UserRole.OPERATOR, UserRole.COLLECTOR), bitacoraController.getAll);
router.get("/:id", requireRole(UserRole.ADMIN, UserRole.OPERATOR, UserRole.COLLECTOR), bitacoraController.getById);
router.post("/", requireRole(UserRole.ADMIN, UserRole.OPERATOR, UserRole.COLLECTOR), bitacoraController.create);
router.put("/:id", requireRole(UserRole.ADMIN, UserRole.OPERATOR), bitacoraController.update);
router.delete("/:id", requireRole(UserRole.ADMIN), bitacoraController.remove);

export default router;
