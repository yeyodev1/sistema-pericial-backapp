import { Request, Response, NextFunction } from "express";
import { sendSuccess } from "../config/httpStatus";
import * as cloudinaryService from "../services/cloudinary.service";

export async function uploadDocument(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.file) {
      return res.status(400).send({ message: "No se ha subido ningún archivo" });
    }

    const folder = String(req.body.folder || "general");
    const result = await cloudinaryService.uploadFile(req.file.buffer, folder, req.file.originalname);

    sendSuccess(res, result, "Archivo subido correctamente");
  } catch (error) {
    next(error);
  }
}
