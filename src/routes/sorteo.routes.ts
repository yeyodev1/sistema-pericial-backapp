import express from "express";
import * as sorteoController from "../controllers/sorteo.controller";

const router = express.Router();

router.get("/", sorteoController.getAll);
router.get("/stats", sorteoController.getStats);
router.get("/:id", sorteoController.getById);
router.post("/", sorteoController.create);
router.put("/:id", sorteoController.update);
router.delete("/:id", sorteoController.remove);

export default router;
