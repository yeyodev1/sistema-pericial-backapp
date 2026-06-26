import crypto from "node:crypto";
import Perito from "../models/Perito";
import User from "../models/User";
import { CustomError } from "../errors/customError.error";
import { encryptFile, encryptText } from "../utils/crypto";
import { emailService } from "./email.service";
import { UserRole } from "../config/constants";

export async function findAll() {
  return Perito.find({ isActive: true }).sort({ createdAt: -1 });
}

export async function findById(id: string) {
  const perito = await Perito.findById(id);
  if (!perito || !perito.isActive) {
    throw new CustomError("Perito not found", 404);
  }
  return perito;
}

export async function findByIdWithFirma(id: string) {
  const perito = await Perito.findById(id).select("+firmaElectronica");
  if (!perito || !perito.isActive) {
    throw new CustomError("Perito not found", 404);
  }
  return perito;
}

export interface CreatePeritoInput {
  nombres: string;
  apellidos: string;
  ruc: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  cuentasBancarias?: {
    banco: string;
    tipoCuenta: "AHORROS" | "CORRIENTE";
    numeroCuenta: string;
  }[];
  fechaVigenciaCalificacion?: Date;
  fechaVencimientoFirma?: Date;
  password?: string;
  sendNotification?: boolean;
}

export interface CreatePeritoResult {
  perito: unknown;
  notificationSent: boolean;
  passwordGenerated: boolean;
  userCreated: boolean;
}

function generatePassword(): string {
  const chars =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  let password = "";
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(crypto.randomInt(chars.length));
  }
  return password;
}

function sanitizeDates(input: Record<string, unknown>): Record<string, unknown> {
  const clean = { ...input };
  for (const key of ["fechaVigenciaCalificacion", "fechaVencimientoFirma"]) {
    if (clean[key] === "" || clean[key] === undefined) {
      delete clean[key];
    }
  }
  return clean;
}

export async function create(
  input: CreatePeritoInput
): Promise<CreatePeritoResult> {
  const existing = await Perito.findOne({ ruc: input.ruc });
  if (existing) {
    throw new CustomError("A perito with this RUC already exists", 409);
  }

  const perito = await Perito.create(sanitizeDates(input as unknown as Record<string, unknown>));

  let notificationSent = false;
  let passwordGenerated = false;
  let userCreated = false;
  const finalPassword = input.password || generatePassword();

  if (input.sendNotification && input.email) {
    passwordGenerated = !input.password;

    try {
      const userName = `${input.nombres} ${input.apellidos}`;

      const existingUser = await User.findOne({ email: input.email });
      if (!existingUser) {
        await User.create({
          email: input.email,
          password: finalPassword,
          name: userName,
          role: UserRole.PERITO,
        });
        userCreated = true;
      }

      await emailService.send({
        to: input.email,
        subject: "Acceso al Sistema Pericial",
        body:
          `Sistema Pericial - Credenciales de Acceso\n` +
          `==========================================\n\n` +
          `Estimado/a ${userName},\n\n` +
          `Has sido registrado/a como perito en el Sistema Pericial.\n\n` +
          `Tus credenciales de acceso son:\n\n` +
          `  Usuario: ${input.email}\n` +
          `  Contraseña: ${finalPassword}\n\n` +
          `Puedes ingresar al sistema a través del siguiente enlace:\n` +
          `  https://yeyo.dev/login\n\n` +
          `Por seguridad, te recomendamos cambiar tu contraseña al iniciar sesión.\n\n` +
          `Saludos cordiales,\n` +
          `Equipo del Sistema Pericial`,
      });

      notificationSent = true;
    } catch (err) {
      console.error("Failed to send notification email:", err);
    }
  }

  return {
    perito,
    notificationSent,
    passwordGenerated,
    userCreated,
  };
}

export async function update(
  id: string,
  input: Partial<CreatePeritoInput>
) {
  const perito = await Perito.findByIdAndUpdate(
    id,
    sanitizeDates(input as unknown as Record<string, unknown>),
    {
      new: true,
      runValidators: true,
    }
  );
  if (!perito) {
    throw new CustomError("Perito not found", 404);
  }
  return perito;
}

export async function softDelete(id: string) {
  const perito = await Perito.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  );
  if (!perito) {
    throw new CustomError("Perito not found", 404);
  }
  return perito;
}

export interface UploadFirmaInput {
  peritoId: string;
  fileBuffer: Buffer;
  fileName: string;
  password: string;
}

export async function uploadFirma(input: UploadFirmaInput) {
  const perito = await Perito.findById(input.peritoId);
  if (!perito || !perito.isActive) {
    throw new CustomError("Perito not found", 404);
  }

  const encryptedFile = encryptFile(input.fileBuffer);
  const encryptedPassword = encryptText(input.password);

  perito.firmaElectronica = {
    data: encryptedFile.data,
    iv: encryptedFile.iv,
    passwordEncrypted: encryptedPassword.encrypted,
    passwordIv: encryptedPassword.iv,
    fileName: input.fileName,
  };

  await perito.save();
  return perito;
}

export async function getVigenciaAlerts(daysThreshold = 30) {
  const thresholdDate = new Date();
  thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);

  return Perito.find({
    isActive: true,
    $or: [
      {
        fechaVigenciaCalificacion: { $lte: thresholdDate },
      },
      {
        fechaVencimientoFirma: { $lte: thresholdDate },
      },
    ],
  }).sort({ fechaVencimientoFirma: 1, fechaVigenciaCalificacion: 1 });
}
