import { Request, Response, NextFunction } from "express";
import { sendSuccess } from "../config/httpStatus";
import * as sorteoService from "../services/sorteo.service";

export async function getAll(req: Request, res: Response, next: NextFunction) {
  try {
    const search = typeof req.query.search === "string" ? req.query.search : undefined;
    const estado = typeof req.query.estado === "string" ? req.query.estado : undefined;
    const sorteos = await sorteoService.findAll({ search, estado });
    sendSuccess(res, sorteos, "Sorteos obtenidos");
  } catch (error) {
    next(error);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const sorteo = await sorteoService.findById(req.params.id as string);
    if (!sorteo) {
      return res.status(404).send({ message: "Sorteo no encontrado" });
    }
    sendSuccess(res, sorteo, "Sorteo obtenido");
  } catch (error) {
    next(error);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const sorteo = await sorteoService.create(req.body);
    sendSuccess(res, sorteo, "Sorteo creado correctamente", 201);
  } catch (error) {
    next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const sorteo = await sorteoService.update(req.params.id as string, req.body);
    if (!sorteo) {
      return res.status(404).send({ message: "Sorteo no encontrado" });
    }
    sendSuccess(res, sorteo, "Sorteo actualizado correctamente");
  } catch (error) {
    next(error);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const sorteo = await sorteoService.remove(req.params.id as string);
    if (!sorteo) {
      return res.status(404).send({ message: "Sorteo no encontrado" });
    }
    sendSuccess(res, null, "Sorteo eliminado correctamente");
  } catch (error) {
    next(error);
  }
}

export async function getStats(req: Request, res: Response, next: NextFunction) {
  try {
    const stats = await sorteoService.getDashboardStats();
    sendSuccess(res, stats, "Estadísticas obtenidas");
  } catch (error) {
    next(error);
  }
}
