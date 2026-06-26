import { Request, Response, NextFunction } from "express";
import { Model } from "mongoose";
import { sendSuccess } from "../config/httpStatus";
import * as catalogService from "../services/catalog.service";

function createCatalogController(model: Model<any>) {
  return {
    async findAll(_req: Request, res: Response, next: NextFunction) {
      try {
        const items = await catalogService.findAll(model);
        sendSuccess(res, items, "Registros obtenidos");
      } catch (error) {
        next(error);
      }
    },

    async findById(req: Request, res: Response, next: NextFunction) {
      try {
        const item = await catalogService.findById(model, String(req.params.id));
        sendSuccess(res, item, "Registro obtenido");
      } catch (error) {
        next(error);
      }
    },

    async create(req: Request, res: Response, next: NextFunction) {
      try {
        const item = await catalogService.create(model, req.body);
        sendSuccess(res, item, "Registro creado correctamente", 201);
      } catch (error) {
        next(error);
      }
    },

    async update(req: Request, res: Response, next: NextFunction) {
      try {
        const item = await catalogService.update(model, String(req.params.id), req.body);
        sendSuccess(res, item, "Registro actualizado correctamente");
      } catch (error) {
        next(error);
      }
    },

    async remove(req: Request, res: Response, next: NextFunction) {
      try {
        const item = await catalogService.softDelete(model, String(req.params.id));
        sendSuccess(res, null, "Registro eliminado correctamente");
      } catch (error) {
        next(error);
      }
    },
  };
}

export default createCatalogController;
