import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/AuthRequest";
import { sendSuccess } from "../config/httpStatus";
import * as comisionService from "../services/comision-perito.service";

export async function getAll(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const query = {
      peritoId: typeof req.query.peritoId === "string" ? req.query.peritoId : undefined,
      clienteId: typeof req.query.clienteId === "string" ? req.query.clienteId : undefined,
      estadoCobro: typeof req.query.estadoCobro === "string" ? req.query.estadoCobro : undefined,
      desde: typeof req.query.desde === "string" ? req.query.desde : undefined,
      hasta: typeof req.query.hasta === "string" ? req.query.hasta : undefined,
      search: typeof req.query.search === "string" ? req.query.search : undefined,
    };

    const rows = await comisionService.findAll(query);
    sendSuccess(res, rows, "Comisiones por perito obtenidas");
  } catch (error) {
    next(error);
  }
}
