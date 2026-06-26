import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/AuthRequest";
import { sendSuccess } from "../config/httpStatus";
import * as configService from "../services/configuracion.service";

export async function getAll(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const configs = await configService.getAllConfigs();
    const result: Record<string, unknown> = {};
    for (const c of configs) {
      result[c.key] = c.data;
    }
    sendSuccess(res, result, "Configuración obtenida");
  } catch (error) {
    next(error);
  }
}

export async function getByKey(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const key = req.params.key as string;
    const data = await configService.getConfig(key as any);
    if (data === null) {
      return res.status(404).send({ message: "Configuración no encontrada" });
    }
    sendSuccess(res, data, "Configuración obtenida");
  } catch (error) {
    next(error);
  }
}

export async function upsert(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const key = req.params.key as string;
    const doc = await configService.upsertConfig(key as any, req.body);
    sendSuccess(res, doc.data, "Configuración guardada correctamente");
  } catch (error) {
    next(error);
  }
}
