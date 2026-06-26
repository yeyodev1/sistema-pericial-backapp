import { Request, Response, NextFunction } from "express";
import { sendSuccess } from "../config/httpStatus";
import * as peritoService from "../services/perito.service";

function getId(req: Request): string {
  return String(req.params.id);
}

export const peritoController = {
  async findAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const peritos = await peritoService.findAll();
      sendSuccess(res, peritos, "Peritos obtenidos");
    } catch (error) {
      next(error);
    }
  },

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const perito = await peritoService.findById(getId(req));
      sendSuccess(res, perito, "Perito obtenido");
    } catch (error) {
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await peritoService.create(req.body);
      sendSuccess(res, result, "Perito creado correctamente", 201);
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const perito = await peritoService.update(getId(req), req.body);
      sendSuccess(res, perito, "Perito actualizado correctamente");
    } catch (error) {
      next(error);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const perito = await peritoService.softDelete(getId(req));
      sendSuccess(res, null, "Perito eliminado correctamente");
    } catch (error) {
      next(error);
    }
  },

  async uploadFirma(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        return res.status(400).send({ message: "No se ha subido ningún archivo" });
      }

      const perito = await peritoService.uploadFirma({
        peritoId: getId(req),
        fileBuffer: req.file.buffer,
        fileName: req.file.originalname,
        password: String(req.body.password || ""),
      });

      sendSuccess(res, perito, "Firma electrónica subida correctamente");
    } catch (error) {
      next(error);
    }
  },

  async getAlerts(_req: Request, res: Response, next: NextFunction) {
    try {
      const alerts = await peritoService.getVigenciaAlerts();
      sendSuccess(res, alerts, "Alertas obtenidas");
    } catch (error) {
      next(error);
    }
  },
};
