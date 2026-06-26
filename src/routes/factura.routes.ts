import express from "express";
import * as facturaController from "../controllers/factura.controller";

const router = express.Router();

router.get("/", facturaController.getAll);
router.get("/stats", facturaController.getStats);
router.get("/:id", facturaController.getById);
router.post("/", facturaController.create);
router.patch("/:id", facturaController.update);
router.delete("/:id", facturaController.remove);

export default router;
