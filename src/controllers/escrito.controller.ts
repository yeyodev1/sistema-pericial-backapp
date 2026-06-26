import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/AuthRequest";
import { sendSuccess } from "../config/httpStatus";
import * as escritoService from "../services/escrito.service";

export async function getAll(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { sorteoId, tipo, estado } = req.query as Record<string, string | undefined>;
    const escritos = await escritoService.findAll({ sorteoId, tipo, estado });
    sendSuccess(res, escritos, "Escritos obtenidos");
  } catch (error) { next(error); }
}

export async function getById(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const escrito = await escritoService.findById(req.params.id as string);
    if (!escrito) return res.status(404).send({ message: "Escrito no encontrado" });
    sendSuccess(res, escrito, "Escrito obtenido");
  } catch (error) { next(error); }
}

export async function create(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const escrito = await escritoService.create(req.body);
    sendSuccess(res, escrito, "Escrito creado correctamente", 201);
  } catch (error) { next(error); }
}

export async function update(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const escrito = await escritoService.update(req.params.id as string, req.body);
    if (!escrito) return res.status(404).send({ message: "Escrito no encontrado" });
    sendSuccess(res, escrito, "Escrito actualizado correctamente");
  } catch (error) { next(error); }
}

export async function remove(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const escrito = await escritoService.remove(req.params.id as string);
    if (!escrito) return res.status(404).send({ message: "Escrito no encontrado" });
    sendSuccess(res, null, "Escrito eliminado correctamente");
  } catch (error) { next(error); }
}

export async function getStats(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const sorteoId = req.params.sorteoId as string;
    const stats = await escritoService.getStatsBySorteo(sorteoId);
    sendSuccess(res, stats, "Estadísticas de escritos obtenidas");
  } catch (error) { next(error); }
}
