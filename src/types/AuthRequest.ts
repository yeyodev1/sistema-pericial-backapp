import { Request } from "express";
import { UserRole } from "../config/constants";

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
  name: string;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}
