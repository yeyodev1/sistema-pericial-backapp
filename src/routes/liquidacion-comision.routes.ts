import { Router } from "express";
import * as liquidacionController from "../controllers/liquidacion-comision.controller";
import { requireRole } from "../middlewares/role.middleware";
import { UserRole } from "../config/constants";

const router = Router();

router.get("/", requireRole(UserRole.ADMIN, UserRole.OPERATOR), liquidacionController.getAll);
router.get("/stats", requireRole(UserRole.ADMIN, UserRole.OPERATOR), liquidacionController.getStats);
router.get("/:id", requireRole(UserRole.ADMIN, UserRole.OPERATOR), liquidacionController.getById);
router.post("/", requireRole(UserRole.ADMIN, UserRole.OPERATOR), liquidacionController.create);
router.put("/:id", requireRole(UserRole.ADMIN, UserRole.OPERATOR), liquidacionController.update);
router.delete("/:id", requireRole(UserRole.ADMIN), liquidacionController.remove);

export default router;
