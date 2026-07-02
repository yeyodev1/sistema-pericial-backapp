import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/AuthRequest";
import { sendSuccess } from "../config/httpStatus";
import * as citaService from "../services/cita.service";

export async function getAll(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const query = {
      sorteoId: typeof req.query.sorteoId === "string" ? req.query.sorteoId : undefined,
      peritoId: typeof req.query.peritoId === "string" ? req.query.peritoId : undefined,
      estado: typeof req.query.estado === "string" ? req.query.estado : undefined,
      search: typeof req.query.search === "string" ? req.query.search : undefined,
      desde: typeof req.query.desde === "string" ? req.query.desde : undefined,
      hasta: typeof req.query.hasta === "string" ? req.query.hasta : undefined,
    };

    if (req.user?.role === "PERITO") {
      query.peritoId = req.user.userId;
    }

    const citas = await citaService.findAll(query);
    sendSuccess(res, citas, "Citas obtenidas");
  } catch (error) {
    next(error);
  }
}

export async function getById(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const cita = await citaService.findById(req.params.id as string);
    if (!cita) {
      return res.status(404).send({ message: "Cita no encontrada" });
    }
    sendSuccess(res, cita, "Cita obtenida");
  } catch (error) {
    next(error);
  }
}

export async function create(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const cita = await citaService.create(req.body);
    sendSuccess(res, cita, "Cita creada correctamente", 201);
  } catch (error) {
    next(error);
  }
}

export async function update(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const cita = await citaService.update(req.params.id as string, req.body);
    if (!cita) {
      return res.status(404).send({ message: "Cita no encontrada" });
    }
    sendSuccess(res, cita, "Cita actualizada correctamente");
  } catch (error) {
    next(error);
  }
}

export async function remove(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const cita = await citaService.remove(req.params.id as string);
    if (!cita) {
      return res.status(404).send({ message: "Cita no encontrada" });
    }
    sendSuccess(res, null, "Cita eliminada correctamente");
  } catch (error) {
    next(error);
  }
}

export async function getStats(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const stats = await citaService.getStats();
    sendSuccess(res, stats, "Estadísticas de citas obtenidas");
  } catch (error) {
    next(error);
  }
}
