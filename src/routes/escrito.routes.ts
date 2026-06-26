import { Router } from "express";
import * as escritoController from "../controllers/escrito.controller";
import { requireRole } from "../middlewares/role.middleware";
import { UserRole } from "../config/constants";

const router = Router();

router.get("/", requireRole(UserRole.ADMIN, UserRole.OPERATOR, UserRole.PERITO), escritoController.getAll);
router.get("/:id", requireRole(UserRole.ADMIN, UserRole.OPERATOR, UserRole.PERITO), escritoController.getById);
router.post("/", requireRole(UserRole.ADMIN, UserRole.OPERATOR), escritoController.create);
router.put("/:id", requireRole(UserRole.ADMIN, UserRole.OPERATOR), escritoController.update);
router.delete("/:id", requireRole(UserRole.ADMIN), escritoController.remove);

export default router;
