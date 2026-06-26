import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/AuthRequest";
import { sendSuccess } from "../config/httpStatus";
import * as facturaService from "../services/factura.service";

export async function getAll(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const estado = typeof req.query.estado === "string" ? req.query.estado : undefined;
    const query: { estado?: string; peritoId?: string } = {};
    if (estado) query.estado = estado;
    if (req.user?.role === "PERITO") query.peritoId = req.user.userId;
    const facturas = await facturaService.findAll(query);
    sendSuccess(res, facturas, "Facturas obtenidas");
  } catch (error) {
    next(error);
  }
}

export async function getById(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const factura = await facturaService.findById(req.params.id as string);
    if (!factura) {
      return res.status(404).send({ message: "Factura no encontrada" });
    }
    sendSuccess(res, factura, "Factura obtenida");
  } catch (error) {
    next(error);
  }
}

export async function create(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const factura = await facturaService.create(req.body);
    sendSuccess(res, factura, "Factura creada correctamente", 201);
  } catch (error) {
    next(error);
  }
}

export async function update(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const factura = await facturaService.update(req.params.id as string, req.body);
    if (!factura) {
      return res.status(404).send({ message: "Factura no encontrada" });
    }
    sendSuccess(res, factura, "Factura actualizada correctamente");
  } catch (error) {
    next(error);
  }
}

export async function remove(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const factura = await facturaService.remove(req.params.id as string);
    if (!factura) {
      return res.status(404).send({ message: "Factura no encontrada" });
    }
    sendSuccess(res, null, "Factura eliminada correctamente");
  } catch (error) {
    next(error);
  }
}

export async function getStats(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const stats = await facturaService.getStats();
    sendSuccess(res, stats, "Estadísticas obtenidas");
  } catch (error) {
    next(error);
  }
}
