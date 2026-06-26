import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/AuthRequest";
import { sendSuccess } from "../config/httpStatus";
import * as accessLogService from "../services/access-log.service";

export async function getAll(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { email, accion, desde, hasta } = req.query as Record<string, string | undefined>;
    const logs = await accessLogService.findAll({ email, accion, desde, hasta });
    sendSuccess(res, logs, "Logs de acceso obtenidos");
  } catch (error) { next(error); }
}
