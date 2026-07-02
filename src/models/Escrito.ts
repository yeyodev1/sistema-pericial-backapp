import mongoose, { Schema, Document } from "mongoose";

export interface IEscrito extends Document {
  sorteoId: mongoose.Types.ObjectId;
  numero?: number;
  descripcion?: string;
  tipo: "DEMANDA" | "CONTESTACION" | "PRUEBA" | "ALEGATO" | "SENTENCIA" | "OTRO";
  fechaPresentacion: Date;
  fechaNotificacion?: Date;
  estado: "PRESENTADO" | "NOTIFICADO" | "RESUELTO" | "ARCHIVADO";
  archivoUrl?: string;
  observaciones: string;
  activo: boolean;
}

const EscritoSchema = new Schema<IEscrito>(
  {
    sorteoId: { type: Schema.Types.ObjectId, ref: "Sorteo", required: true },
    numero: { type: Number },
    descripcion: { type: String, trim: true, default: "" },
    tipo: {
      type: String,
      enum: ["DEMANDA", "CONTESTACION", "PRUEBA", "ALEGATO", "SENTENCIA", "OTRO"],
      required: true,
    },
    fechaPresentacion: { type: Date, required: true },
    fechaNotificacion: { type: Date },
    estado: {
      type: String,
      enum: ["PRESENTADO", "NOTIFICADO", "RESUELTO", "ARCHIVADO"],
      default: "PRESENTADO",
    },
    archivoUrl: { type: String },
    observaciones: { type: String, default: "" },
    activo: { type: Boolean, default: true },
  },
  { timestamps: true }
);

EscritoSchema.index({ sorteoId: 1, fechaPresentacion: -1 });

export default mongoose.model<IEscrito>("Escrito", EscritoSchema);
