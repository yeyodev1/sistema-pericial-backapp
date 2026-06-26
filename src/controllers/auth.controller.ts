import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../types/AuthRequest";
import { sendSuccess } from "../config/httpStatus";
import { login, getCurrentUser, updateProfile, updatePassword } from "../services/auth.service";
import { CustomError } from "../errors/customError.error";
import { isWithinBusinessHours } from "../middlewares/businessHours.middleware";
import { BUSINESS_HOURS, UserRole } from "../config/constants";
import { emailService } from "../services/email.service";

export async function loginController(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new CustomError("Email and password are required", 400);
    }

    const result = await login({ email, password });

    if (result.user.role !== UserRole.ADMIN && !isWithinBusinessHours(new Date())) {
      return res.status(403).send({ message: BUSINESS_HOURS.blockedMessage });
    }

    emailService
      .sendLoginNotification(result.user.email, result.user.name)
      .catch((err) => console.error("Email notification failed:", err));

    sendSuccess(res, result, "Inicio de sesión exitoso");
  } catch (error) {
    next(error);
  }
}

export async function getCurrentUserController(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new CustomError("No autenticado", 401);
    }
    const user = await getCurrentUser(req.user.userId);
    sendSuccess(res, user, "Datos de usuario obtenidos");
  } catch (error) {
    next(error);
  }
}

export async function updateProfileController(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new CustomError("No autenticado", 401);
    }
    const result = await updateProfile(req.user.userId, req.body);
    sendSuccess(res, result, "Perfil actualizado correctamente");
  } catch (error) {
    next(error);
  }
}

export async function updatePasswordController(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new CustomError("No autenticado", 401);
    }
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      throw new CustomError("currentPassword y newPassword son requeridos", 400);
    }
    if (newPassword.length < 6) {
      throw new CustomError("La nueva contraseña debe tener al menos 6 caracteres", 400);
    }
    await updatePassword(req.user.userId, { currentPassword, newPassword });
    sendSuccess(res, null, "Contraseña actualizada correctamente");
  } catch (error) {
    next(error);
  }
}
