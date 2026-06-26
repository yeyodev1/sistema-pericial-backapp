import express from "express";
import { z } from "zod";
import Juez from "../models/Juez";
import Juzgado from "../models/Juzgado";
import UnidadJudicial from "../models/UnidadJudicial";
import Cliente from "../models/Cliente";
import createCatalogController from "../controllers/catalog.controller";
import { validateSchema } from "../middlewares/validate.middleware";

const router = express.Router();

const juezSchema = z.object({
  nombres: z.string().min(1),
  apellidos: z.string().min(1),
  email: z.string().email().optional().or(z.literal("")),
  telefono: z.string().optional().or(z.literal("")),
});

const juzgadoSchema = z.object({
  nombre: z.string().min(1),
  direccion: z.string().optional().or(z.literal("")),
  ciudad: z.string().optional().or(z.literal("")),
  zona: z.enum(["CENTRO", "NORTE", "SUR", "OTRO"]).optional(),
});

const unidadJudicialSchema = z.object({
  nombre: z.string().min(1),
  juzgadoId: z.string().optional(),
  direccion: z.string().optional().or(z.literal("")),
  ciudad: z.string().optional().or(z.literal("")),
  zona: z.enum(["CENTRO", "NORTE", "SUR", "OTRO"]).optional(),
});

const clienteSchema = z.object({
  nombre: z.string().min(1),
  ruc: z.string().optional().or(z.literal("")),
  direccion: z.string().optional().or(z.literal("")),
  tipo: z.enum(["BANCO", "EMPRESA", "PARTICULAR"]).optional(),
});

const juezController = createCatalogController(Juez);
const juzgadoController = createCatalogController(Juzgado);
const unidadJudicialController = createCatalogController(UnidadJudicial);
const clienteController = createCatalogController(Cliente);

router.get("/jueces", juezController.findAll);
router.get("/jueces/:id", juezController.findById);
router.post("/jueces", validateSchema(juezSchema), juezController.create);
router.patch("/jueces/:id", validateSchema(juezSchema.partial()), juezController.update);
router.delete("/jueces/:id", juezController.remove);

router.get("/juzgados", juzgadoController.findAll);
router.get("/juzgados/:id", juzgadoController.findById);
router.post("/juzgados", validateSchema(juzgadoSchema), juzgadoController.create);
router.patch("/juzgados/:id", validateSchema(juzgadoSchema.partial()), juzgadoController.update);
router.delete("/juzgados/:id", juzgadoController.remove);

router.get("/unidades-judiciales", unidadJudicialController.findAll);
router.get("/unidades-judiciales/:id", unidadJudicialController.findById);
router.post("/unidades-judiciales", validateSchema(unidadJudicialSchema), unidadJudicialController.create);
router.patch("/unidades-judiciales/:id", validateSchema(unidadJudicialSchema.partial()), unidadJudicialController.update);
router.delete("/unidades-judiciales/:id", unidadJudicialController.remove);

router.get("/clientes", clienteController.findAll);
router.get("/clientes/:id", clienteController.findById);
router.post("/clientes", validateSchema(clienteSchema), clienteController.create);
router.patch("/clientes/:id", validateSchema(clienteSchema.partial()), clienteController.update);
router.delete("/clientes/:id", clienteController.remove);

export default router;
