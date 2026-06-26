import express from "express";
import multer from "multer";
import { z } from "zod";
import { peritoController } from "../controllers/perito.controller";
import { validateSchema } from "../middlewares/validate.middleware";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const cuentaBancariaSchema = z.object({
  banco: z.string().min(1),
  tipoCuenta: z.enum(["AHORROS", "CORRIENTE"]),
  numeroCuenta: z.string().min(1),
});

const peritoSchema = z.object({
  nombres: z.string().min(1),
  apellidos: z.string().min(1),
  ruc: z.string().length(13),
  direccion: z.string().optional().or(z.literal("")),
  telefono: z.string().optional().or(z.literal("")),
  email: z.string().email().optional().or(z.literal("")),
  cuentasBancarias: z.array(cuentaBancariaSchema).optional(),
  fechaVigenciaCalificacion: z.string().optional().or(z.literal("")),
  fechaVencimientoFirma: z.string().optional().or(z.literal("")),
});

router.get("/", peritoController.findAll);
router.get("/alerts", peritoController.getAlerts);
router.get("/:id", peritoController.findById);
router.post("/", validateSchema(peritoSchema), peritoController.create);
router.patch("/:id", validateSchema(peritoSchema.partial()), peritoController.update);
router.delete("/:id", peritoController.remove);
router.post(
  "/:id/firma",
  upload.single("firma"),
  peritoController.uploadFirma
);

export default router;
