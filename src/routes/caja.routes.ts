import { Router } from "express";
import * as cajaController from "../controllers/caja.controller";
import { requireRole } from "../middlewares/role.middleware";
import { UserRole } from "../config/constants";

const router = Router();

router.get("/", requireRole(UserRole.ADMIN, UserRole.OPERATOR), cajaController.getAll);
router.get("/resumen", requireRole(UserRole.ADMIN, UserRole.OPERATOR), cajaController.getResumen);
router.get("/:id", requireRole(UserRole.ADMIN, UserRole.OPERATOR), cajaController.getById);
router.post("/", requireRole(UserRole.ADMIN, UserRole.OPERATOR), cajaController.create);
router.put("/:id", requireRole(UserRole.ADMIN, UserRole.OPERATOR), cajaController.update);
router.delete("/:id", requireRole(UserRole.ADMIN), cajaController.remove);

export default router;
