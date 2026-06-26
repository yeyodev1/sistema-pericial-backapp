import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/AuthRequest";
import { sendSuccess } from "../config/httpStatus";
import * as agendaService from "../services/agenda-campo.service";

export async function getAll(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { peritoId, estado, desde, hasta } = req.query as Record<string, string | undefined>;
    const query: { peritoId?: string; estado?: string; desde?: string; hasta?: string } = {};
    if (peritoId) query.peritoId = peritoId;
    if (estado) query.estado = estado;
    if (desde) query.desde = desde;
    if (hasta) query.hasta = hasta;
    if (req.user?.role === "PERITO") query.peritoId = req.user?.userId;
    const diligencias = await agendaService.findAll(query);
    sendSuccess(res, diligencias, "Diligencias obtenidas");
  } catch (error) { next(error); }
}

export async function getById(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const diligencia = await agendaService.findById(req.params.id as string);
    if (!diligencia) return res.status(404).send({ message: "Diligencia no encontrada" });
    sendSuccess(res, diligencia, "Diligencia obtenida");
  } catch (error) { next(error); }
}

export async function create(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const diligencia = await agendaService.create(req.body);
    sendSuccess(res, diligencia, "Diligencia creada correctamente", 201);
  } catch (error) { next(error); }
}

export async function update(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const diligencia = await agendaService.update(req.params.id as string, req.body);
    if (!diligencia) return res.status(404).send({ message: "Diligencia no encontrada" });
    sendSuccess(res, diligencia, "Diligencia actualizada correctamente");
  } catch (error) { next(error); }
}

export async function remove(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const diligencia = await agendaService.remove(req.params.id as string);
    if (!diligencia) return res.status(404).send({ message: "Diligencia no encontrada" });
    sendSuccess(res, null, "Diligencia eliminada correctamente");
  } catch (error) { next(error); }
}

export async function getStats(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const stats = await agendaService.getStats();
    sendSuccess(res, stats, "Estadísticas obtenidas");
  } catch (error) { next(error); }
}
