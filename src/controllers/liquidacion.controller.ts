import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/AuthRequest";
import { sendSuccess } from "../config/httpStatus";
import * as liquidacionService from "../services/liquidacion.service";

export async function getAll(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const estado = typeof req.query.estado === "string" ? req.query.estado : undefined;
    const query: { estado?: string; peritoId?: string } = {};
    if (estado) query.estado = estado;
    if (req.user?.role === "PERITO") query.peritoId = req.user.userId;
    const liquidaciones = await liquidacionService.findAll(query);
    sendSuccess(res, liquidaciones, "Liquidaciones obtenidas");
  } catch (error) {
    next(error);
  }
}

export async function getById(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const liquidacion = await liquidacionService.findById(req.params.id as string);
    if (!liquidacion) {
      return res.status(404).send({ message: "Liquidación no encontrada" });
    }
    sendSuccess(res, liquidacion, "Liquidación obtenida");
  } catch (error) {
    next(error);
  }
}

export async function create(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const liquidacion = await liquidacionService.create(req.body);
    sendSuccess(res, liquidacion, "Liquidación creada correctamente", 201);
  } catch (error) {
    next(error);
  }
}

export async function update(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const liquidacion = await liquidacionService.update(req.params.id as string, req.body);
    if (!liquidacion) {
      return res.status(404).send({ message: "Liquidación no encontrada" });
    }
    sendSuccess(res, liquidacion, "Liquidación actualizada correctamente");
  } catch (error) {
    next(error);
  }
}

export async function remove(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const liquidacion = await liquidacionService.remove(req.params.id as string);
    if (!liquidacion) {
      return res.status(404).send({ message: "Liquidación no encontrada" });
    }
    sendSuccess(res, null, "Liquidación eliminada correctamente");
  } catch (error) {
    next(error);
  }
}

export async function getStats(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const stats = await liquidacionService.getStats();
    sendSuccess(res, stats, "Estadísticas obtenidas");
  } catch (error) {
    next(error);
  }
}
