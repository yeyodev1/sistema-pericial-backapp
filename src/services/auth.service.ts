import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User, { IUser } from "../models/User";
import { CustomError } from "../errors/customError.error";
import { UserRole } from "../config/constants";

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
  };
}

export async function login(input: LoginInput): Promise<LoginResponse> {
  const { email, password } = input;

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    throw new CustomError("Invalid email or password", 401);
  }

  if (!user.isActive) {
    throw new CustomError("User is inactive", 403);
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new CustomError("JWT_SECRET is not configured", 500);
  }

  const token = jwt.sign(
    {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    },
    secret,
    { expiresIn: "8h" }
  );

  return {
    token,
    user: {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role as UserRole,
    },
  };
}

export async function getCurrentUser(
  userId: string
): Promise<{ id: string; name: string; email: string; role: UserRole }> {
  const user = await User.findById(userId);
  if (!user) {
    throw new CustomError("Usuario no encontrado", 404);
  }
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role as UserRole,
  };
}

export async function updateProfile(
  userId: string,
  data: { name?: string; email?: string }
): Promise<{ id: string; name: string; email: string; role: UserRole }> {
  const update: Record<string, string> = {};
  if (data.name) update.name = data.name;
  if (data.email) update.email = data.email;

  if (data.email) {
    const existing = await User.findOne({ email: data.email, _id: { $ne: userId } });
    if (existing) {
      throw new CustomError("El email ya está en uso por otro usuario", 409);
    }
  }

  const user = await User.findByIdAndUpdate(userId, { $set: update }, { new: true, runValidators: true });
  if (!user) {
    throw new CustomError("Usuario no encontrado", 404);
  }

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role as UserRole,
  };
}

export async function updatePassword(
  userId: string,
  data: { currentPassword: string; newPassword: string }
): Promise<void> {
  const user = await User.findById(userId).select("+password");
  if (!user) {
    throw new CustomError("Usuario no encontrado", 404);
  }

  const isMatch = await bcrypt.compare(data.currentPassword, user.password);
  if (!isMatch) {
    throw new CustomError("La contraseña actual no es correcta", 400);
  }

  user.password = data.newPassword;
  await user.save();
}
