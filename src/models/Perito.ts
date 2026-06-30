import mongoose, { Schema, Document } from "mongoose";

export interface ICuentaBancaria {
  banco: string;
  tipoCuenta: "AHORROS" | "CORRIENTE";
  numeroCuenta: string;
}

export interface IPeritoEspecialidad {
  areaProfesion: string;
  especialidad: string;
  ciudad?: string;
  fechaSolicitud?: Date;
  fechaVencimiento?: Date;
  observaciones?: string;
}

export interface IFirmaElectronica {
  data: Buffer;
  iv: string;
  passwordEncrypted: string;
  passwordIv: string;
  fileName: string;
}

export interface IPerito extends Document {
  codigoRegistro?: string;
  nombres: string;
  apellidos: string;
  ruc: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  notificationEmails: string[];
  cuentasBancarias: ICuentaBancaria[];
  especialidades: IPeritoEspecialidad[];
  firmaElectronica?: IFirmaElectronica;
  fechaVigenciaCalificacion?: Date;
  fechaVencimientoFirma?: Date;
  isActive: boolean;
}

const CuentaBancariaSchema = new Schema<ICuentaBancaria>(
  {
    banco: { type: String, required: true, trim: true },
    tipoCuenta: {
      type: String,
      enum: ["AHORROS", "CORRIENTE"],
      required: true,
    },
    numeroCuenta: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const PeritoEspecialidadSchema = new Schema<IPeritoEspecialidad>(
  {
    areaProfesion: { type: String, required: true, trim: true },
    especialidad: { type: String, required: true, trim: true },
    ciudad: { type: String, trim: true },
    fechaSolicitud: { type: Date },
    fechaVencimiento: { type: Date },
    observaciones: { type: String, trim: true },
  },
  { _id: false }
);

const FirmaElectronicaSchema = new Schema<IFirmaElectronica>(
  {
    data: { type: Buffer, required: true },
    iv: { type: String, required: true },
    passwordEncrypted: { type: String, required: true },
    passwordIv: { type: String, required: true },
    fileName: { type: String, required: true },
  },
  { _id: false }
);

const PeritoSchema = new Schema<IPerito>(
  {
    codigoRegistro: { type: String, required: true, trim: true, unique: true, sparse: true },
    nombres: { type: String, required: true, trim: true },
    apellidos: { type: String, required: true, trim: true },
    ruc: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: /^\d{13}$/,
    },
    direccion: { type: String, trim: true },
    telefono: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    notificationEmails: {
      type: [String],
      default: [],
      set: (value: string[]) =>
        Array.isArray(value)
          ? value.map((email) => String(email).trim().toLowerCase()).filter(Boolean)
          : [],
    },
    cuentasBancarias: { type: [CuentaBancariaSchema], default: [] },
    especialidades: { type: [PeritoEspecialidadSchema], default: [] },
    firmaElectronica: { type: FirmaElectronicaSchema, select: false },
    fechaVigenciaCalificacion: { type: Date },
    fechaVencimientoFirma: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

PeritoSchema.index({ codigoRegistro: 1 });
PeritoSchema.index({ nombres: "text", apellidos: "text", ruc: "text", codigoRegistro: "text" });

export default mongoose.model<IPerito>("Perito", PeritoSchema);
