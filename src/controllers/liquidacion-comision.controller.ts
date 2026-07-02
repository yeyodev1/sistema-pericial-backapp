import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/AuthRequest";
import { sendSuccess } from "../config/httpStatus";
import * as liquidacionComisionService from "../services/liquidacion-comision.service";

export async function getAll(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const query = {
      peritoId: typeof req.query.peritoId === "string" ? req.query.peritoId : undefined,
      liquidado: typeof req.query.liquidado === "string" ? req.query.liquidado : undefined,
      desde: typeof req.query.desde === "string" ? req.query.desde : undefined,
      hasta: typeof req.query.hasta === "string" ? req.query.hasta : undefined,
    };

    const liquidaciones = await liquidacionComisionService.findAll(query);
    sendSuccess(res, liquidaciones, "Liquidaciones de comisión obtenidas");
  } catch (error) {
    next(error);
  }
}

export async function getById(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const liquidacion = await liquidacionComisionService.findById(req.params.id as string);
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
    const liquidacion = await liquidacionComisionService.create(req.body);
    sendSuccess(res, liquidacion, "Liquidación creada correctamente", 201);
  } catch (error) {
    next(error);
  }
}

export async function update(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const liquidacion = await liquidacionComisionService.update(req.params.id as string, req.body);
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
    const liquidacion = await liquidacionComisionService.remove(req.params.id as string);
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
    const stats = await liquidacionComisionService.getStats();
    sendSuccess(res, stats, "Estadísticas de liquidación obtenidas");
  } catch (error) {
    next(error);
  }
}
