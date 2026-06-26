import express from "express";
import * as liquidacionController from "../controllers/liquidacion.controller";

const router = express.Router();

router.get("/", liquidacionController.getAll);
router.get("/stats", liquidacionController.getStats);
router.get("/:id", liquidacionController.getById);
router.post("/", liquidacionController.create);
router.patch("/:id", liquidacionController.update);
router.delete("/:id", liquidacionController.remove);

export default router;
