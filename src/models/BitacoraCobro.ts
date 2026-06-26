import mongoose, { Schema, Document } from "mongoose";

export interface IBitacoraCobro extends Document {
  sorteoId: mongoose.Types.ObjectId;
  cobradorId: mongoose.Types.ObjectId;
  fecha: Date;
  tipoGestion: "VISITA" | "LLAMADA" | "CORREO" | "NOTIFICACION_JUDICIAL";
  resultado: "PENDIENTE" | "CONTACTO_EXITOSO" | "PROMESA_PAGO" | "PAGO_PARCIAL" | "PAGO_TOTAL" | "SIN_RESULTADO";
  proximaAccion: string;
  proximaFecha?: Date;
  observaciones: string;
  activo: boolean;
}

const BitacoraCobroSchema = new Schema<IBitacoraCobro>(
  {
    sorteoId: { type: Schema.Types.ObjectId, ref: "Sorteo", required: true },
    cobradorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    fecha: { type: Date, required: true, default: Date.now },
    tipoGestion: {
      type: String,
      enum: ["VISITA", "LLAMADA", "CORREO", "NOTIFICACION_JUDICIAL"],
      required: true,
    },
    resultado: {
      type: String,
      enum: ["PENDIENTE", "CONTACTO_EXITOSO", "PROMESA_PAGO", "PAGO_PARCIAL", "PAGO_TOTAL", "SIN_RESULTADO"],
      default: "PENDIENTE",
    },
    proximaAccion: { type: String, default: "" },
    proximaFecha: { type: Date },
    observaciones: { type: String, default: "" },
    activo: { type: Boolean, default: true },
  },
  { timestamps: true }
);

BitacoraCobroSchema.index({ sorteoId: 1, fecha: -1 });
BitacoraCobroSchema.index({ cobradorId: 1 });

export default mongoose.model<IBitacoraCobro>("BitacoraCobro", BitacoraCobroSchema);
