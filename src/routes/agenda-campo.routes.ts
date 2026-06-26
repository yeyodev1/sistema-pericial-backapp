import { Router } from "express";
import * as agendaController from "../controllers/agenda-campo.controller";
import { requireRole } from "../middlewares/role.middleware";
import { UserRole } from "../config/constants";

const router = Router();

router.get("/", requireRole(UserRole.ADMIN, UserRole.OPERATOR, UserRole.COLLECTOR, UserRole.PERITO), agendaController.getAll);
router.get("/stats", requireRole(UserRole.ADMIN, UserRole.OPERATOR), agendaController.getStats);
router.get("/:id", requireRole(UserRole.ADMIN, UserRole.OPERATOR, UserRole.COLLECTOR, UserRole.PERITO), agendaController.getById);
router.post("/", requireRole(UserRole.ADMIN, UserRole.OPERATOR), agendaController.create);
router.put("/:id", requireRole(UserRole.ADMIN, UserRole.OPERATOR), agendaController.update);
router.delete("/:id", requireRole(UserRole.ADMIN), agendaController.remove);

export default router;
