import { Router } from "express";
import * as accessLogController from "../controllers/access-log.controller";
import { requireRole } from "../middlewares/role.middleware";
import { UserRole } from "../config/constants";

const router = Router();

router.get("/", requireRole(UserRole.ADMIN), accessLogController.getAll);

export default router;
