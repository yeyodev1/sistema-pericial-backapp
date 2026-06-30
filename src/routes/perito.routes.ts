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

const especialidadSchema = z.object({
  areaProfesion: z.string().min(1),
  especialidad: z.string().min(1),
  ciudad: z.string().optional().or(z.literal("")),
  fechaSolicitud: z.string().optional().or(z.literal("")),
  fechaVencimiento: z.string().optional().or(z.literal("")),
  observaciones: z.string().optional().or(z.literal("")),
});

const peritoSchema = z.object({
  codigoRegistro: z.string().min(1),
  nombres: z.string().min(1),
  apellidos: z.string().min(1),
  ruc: z.string().length(13),
  direccion: z.string().optional().or(z.literal("")),
  telefono: z.string().optional().or(z.literal("")),
  email: z.string().email().optional().or(z.literal("")),
  notificationEmails: z.array(z.string().email()).optional(),
  cuentasBancarias: z.array(cuentaBancariaSchema).optional(),
  especialidades: z.array(especialidadSchema).optional(),
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
