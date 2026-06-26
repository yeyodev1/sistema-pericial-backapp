import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/AuthRequest";
import { sendSuccess } from "../config/httpStatus";
import * as bitacoraService from "../services/bitacora-cobro.service";

export async function getAll(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { sorteoId, cobradorId } = req.query as Record<string, string | undefined>;
    const query: { sorteoId?: string; cobradorId?: string } = {};
    if (sorteoId) query.sorteoId = sorteoId;
    if (cobradorId) query.cobradorId = cobradorId;
    if (req.user?.role === "COLLECTOR") query.cobradorId = req.user.userId;
    const registros = await bitacoraService.findAll(query);
    sendSuccess(res, registros, "Registros de cobro obtenidos");
  } catch (error) { next(error); }
}

export async function getById(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const registro = await bitacoraService.findById(req.params.id as string);
    if (!registro) return res.status(404).send({ message: "Registro no encontrado" });
    sendSuccess(res, registro, "Registro obtenido");
  } catch (error) { next(error); }
}

export async function create(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = { ...req.body, cobradorId: req.user?.userId };
    const registro = await bitacoraService.create(data);
    sendSuccess(res, registro, "Registro creado correctamente", 201);
  } catch (error) { next(error); }
}

export async function update(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const registro = await bitacoraService.update(req.params.id as string, req.body);
    if (!registro) return res.status(404).send({ message: "Registro no encontrado" });
    sendSuccess(res, registro, "Registro actualizado correctamente");
  } catch (error) { next(error); }
}

export async function remove(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const registro = await bitacoraService.remove(req.params.id as string);
    if (!registro) return res.status(404).send({ message: "Registro no encontrado" });
    sendSuccess(res, null, "Registro eliminado correctamente");
  } catch (error) { next(error); }
}
