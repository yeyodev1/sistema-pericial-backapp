import express from "express";
import * as configController from "../controllers/configuracion.controller";

const router = express.Router();

router.get("/", configController.getAll);
router.get("/:key", configController.getByKey);
router.put("/:key", configController.upsert);

export default router;
