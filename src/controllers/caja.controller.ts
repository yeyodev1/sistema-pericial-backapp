import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/AuthRequest";
import { sendSuccess } from "../config/httpStatus";
import * as cajaService from "../services/caja.service";

export async function getAll(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { desde, hasta, tipoMovimiento, peritoId } = req.query as Record<string, string | undefined>;
    const movimientos = await cajaService.findAll({ desde, hasta, tipoMovimiento, peritoId });
    sendSuccess(res, movimientos, "Movimientos obtenidos");
  } catch (error) { next(error); }
}

export async function getById(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const movimiento = await cajaService.findById(req.params.id as string);
    if (!movimiento) return res.status(404).send({ message: "Movimiento no encontrado" });
    sendSuccess(res, movimiento, "Movimiento obtenido");
  } catch (error) { next(error); }
}

export async function create(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = { ...req.body, registradoPor: req.user?.userId };
    const movimiento = await cajaService.create(data);
    sendSuccess(res, movimiento, "Movimiento registrado correctamente", 201);
  } catch (error) { next(error); }
}

export async function update(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const movimiento = await cajaService.update(req.params.id as string, req.body);
    if (!movimiento) return res.status(404).send({ message: "Movimiento no encontrado" });
    sendSuccess(res, movimiento, "Movimiento actualizado correctamente");
  } catch (error) { next(error); }
}

export async function remove(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const movimiento = await cajaService.remove(req.params.id as string);
    if (!movimiento) return res.status(404).send({ message: "Movimiento no encontrado" });
    sendSuccess(res, null, "Movimiento eliminado correctamente");
  } catch (error) { next(error); }
}

export async function getResumen(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const resumen = await cajaService.getResumen();
    sendSuccess(res, resumen, "Resumen de caja obtenido");
  } catch (error) { next(error); }
}
