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
  codigoRegistro: string;
  nombres: string;
  apellidos: string;
  ruc: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  notificationEmails?: string[];
  cuentasBancarias?: {
    banco: string;
    tipoCuenta: "AHORROS" | "CORRIENTE";
    numeroCuenta: string;
  }[];
  especialidades?: {
    areaProfesion: string;
    especialidad: string;
    ciudad?: string;
    fechaSolicitud?: Date;
    fechaVencimiento?: Date;
    observaciones?: string;
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
  if (Array.isArray(clean.especialidades)) {
    clean.especialidades = clean.especialidades.map((item) => {
      if (!item || typeof item !== "object") return item;
      const especialidad = { ...(item as Record<string, unknown>) };
      for (const key of ["fechaSolicitud", "fechaVencimiento"]) {
        if (especialidad[key] === "" || especialidad[key] === undefined) {
          delete especialidad[key];
        }
      }
      return especialidad;
    });
  }
  if (Array.isArray(clean.notificationEmails)) {
    clean.notificationEmails = clean.notificationEmails
      .map((email) => String(email).trim().toLowerCase())
      .filter(Boolean);
  }
  return clean;
}

function uniqueEmails(...groups: Array<string | undefined | null | (string | undefined | null)[]>) {
  const set = new Set<string>();
  for (const group of groups) {
    if (Array.isArray(group)) {
      for (const item of group) {
        const email = String(item || "").trim().toLowerCase();
        if (email) set.add(email);
      }
    } else {
      const email = String(group || "").trim().toLowerCase();
      if (email) set.add(email);
    }
  }
  return [...set];
}

export async function create(
  input: CreatePeritoInput
): Promise<CreatePeritoResult> {
  const active = await Perito.findOne({ ruc: input.ruc, isActive: true });
  if (active) {
    throw new CustomError("A perito with this RUC already exists", 409);
  }

  let perito: unknown;

  const softDeleted = await Perito.findOne({ ruc: input.ruc, isActive: false });
  if (softDeleted) {
    softDeleted.set(sanitizeDates(input as unknown as Record<string, unknown>));
    softDeleted.isActive = true;
    await softDeleted.save();
    perito = softDeleted;
  } else {
    perito = await Perito.create(sanitizeDates(input as unknown as Record<string, unknown>));
  }

  let notificationSent = false;
  let passwordGenerated = false;
  let userCreated = false;
  const finalPassword = input.password || generatePassword();

   const recipients = uniqueEmails(input.email, input.notificationEmails || []);

   if (input.sendNotification && recipients.length > 0) {
    passwordGenerated = !input.password;

    try {
      const userName = `${input.nombres} ${input.apellidos}`;

      const existingUser = input.email ? await User.findOne({ email: input.email }) : null;
      if (!existingUser && input.email) {
        await User.create({
          email: input.email,
          password: finalPassword,
          name: userName,
          role: UserRole.PERITO,
        });
        userCreated = true;
      }

      await Promise.all(
        recipients.map((recipient) =>
          emailService.send({
            to: recipient,
            subject: "Acceso al Sistema Pericial",
            body:
              `Sistema Pericial - Credenciales de Acceso\n` +
              `==========================================\n\n` +
              `Estimado/a ${userName},\n\n` +
              `Has sido registrado/a como perito en el Sistema Pericial.\n\n` +
              `Tus credenciales de acceso son:\n\n` +
              `  Usuario: ${input.email || recipient}\n` +
              `  Contraseña: ${finalPassword}\n\n` +
              `Puedes ingresar al sistema a través del siguiente enlace:\n` +
              `  https://yeyo.dev/login\n\n` +
              `Por seguridad, te recomendamos cambiar tu contraseña al iniciar sesión.\n\n` +
              `Saludos cordiales,\n` +
              `Equipo del Sistema Pericial`,
          })
        )
      );

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
      {
        especialidades: {
          $elemMatch: {
            fechaVencimiento: { $lte: thresholdDate },
          },
        },
      },
    ],
  }).sort({ fechaVencimientoFirma: 1, fechaVigenciaCalificacion: 1 });
}
