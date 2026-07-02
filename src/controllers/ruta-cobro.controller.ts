import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/AuthRequest";
import { sendSuccess } from "../config/httpStatus";
import * as rutaCobroService from "../services/ruta-cobro.service";

export async function getAll(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const query = {
      peritoId: typeof req.query.peritoId === "string" ? req.query.peritoId : undefined,
      clienteId: typeof req.query.clienteId === "string" ? req.query.clienteId : undefined,
      search: typeof req.query.search === "string" ? req.query.search : undefined,
      desde: typeof req.query.desde === "string" ? req.query.desde : undefined,
      hasta: typeof req.query.hasta === "string" ? req.query.hasta : undefined,
      mostrarDia: req.query.mostrarDia === "true",
      soloEntregadas: req.query.soloEntregadas === "true",
    };

    const rows = await rutaCobroService.findAll(query);
    sendSuccess(res, rows, "Ruta de cobros obtenida");
  } catch (error) {
    next(error);
  }
}
