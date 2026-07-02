import express, { Application } from "express";
import authRouter from "./auth.routes";
import catalogRouter from "./catalog.routes";
import peritoRouter from "./perito.routes";
import sorteoRouter from "./sorteo.routes";
import facturaRouter from "./factura.routes";
import liquidacionRouter from "./liquidacion.routes";
import liquidacionComisionRouter from "./liquidacion-comision.routes";
import configuracionRouter from "./configuracion.routes";
import uploadRouter from "./upload.routes";
import escritoRouter from "./escrito.routes";
import bitacoraCobroRouter from "./bitacora-cobro.routes";
import agendaCampoRouter from "./agenda-campo.routes";
import citaRouter from "./cita.routes";
import rutaCobroRouter from "./ruta-cobro.routes";
import comisionPeritoRouter from "./comision-perito.routes";
import cajaRouter from "./caja.routes";
import accessLogRouter from "./access-log.routes";
import { authMiddleware } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";
import { UserRole } from "../config/constants";

function routerApi(app: Application) {
  const router = express.Router();
  app.use("/api", router);

  router.use("/auth", authRouter);
  router.use("/catalogs", authMiddleware, catalogRouter);
  router.use("/peritos", authMiddleware, peritoRouter);
  router.use("/sorteos", authMiddleware, sorteoRouter);
  router.use("/facturas", authMiddleware, facturaRouter);
  router.use("/liquidaciones", authMiddleware, requireRole(UserRole.ADMIN, UserRole.OPERATOR), liquidacionRouter);
  router.use("/configuracion", authMiddleware, requireRole(UserRole.ADMIN), configuracionRouter);
  router.use("/upload", authMiddleware, uploadRouter);
  router.use("/escritos", authMiddleware, escritoRouter);
  router.use("/bitacora-cobro", authMiddleware, bitacoraCobroRouter);
  router.use("/agenda-campo", authMiddleware, agendaCampoRouter);
  router.use("/citas", authMiddleware, citaRouter);
  router.use("/ruta-cobros", authMiddleware, rutaCobroRouter);
  router.use("/comisiones-perito", authMiddleware, comisionPeritoRouter);
  router.use("/liquidacion-comisiones", authMiddleware, liquidacionComisionRouter);
  router.use("/caja", authMiddleware, requireRole(UserRole.ADMIN, UserRole.OPERATOR), cajaRouter);
  router.use("/access-logs", authMiddleware, requireRole(UserRole.ADMIN), accessLogRouter);
}

export default routerApi;
