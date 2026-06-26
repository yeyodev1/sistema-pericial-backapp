import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/AuthRequest";
import { UserRole } from "../config/constants";
import { CustomError } from "../errors/customError.error";

export function requireRole(...allowedRoles: UserRole[]) {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      next(new CustomError("Authentication required", 401));
      return;
    }

    if (!allowedRoles.includes(user.role as UserRole)) {
      next(new CustomError("Insufficient permissions", 403));
      return;
    }

    next();
  };
}
