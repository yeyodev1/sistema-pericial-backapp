import mongoose, { Schema, Document } from "mongoose";

export interface ICita extends Document {
  sorteoId: mongoose.Types.ObjectId;
  peritoId: mongoose.Types.ObjectId;
  fechaCita: Date;
  horaCita: string;
  lugarCita: string;
  observacion?: string;
  estado: "PROGRAMADA" | "CONFIRMADA" | "IMPUGNADA" | "CANCELADA";
  confirmada: boolean;
  impugnada: boolean;
  fechaImpugnacion?: Date;
  activo: boolean;
}

const CitaSchema = new Schema<ICita>(
  {
    sorteoId: { type: Schema.Types.ObjectId, ref: "Sorteo", required: true },
    peritoId: { type: Schema.Types.ObjectId, ref: "Perito", required: true },
    fechaCita: { type: Date, required: true },
    horaCita: { type: String, required: true, trim: true },
    lugarCita: { type: String, required: true, trim: true },
    observacion: { type: String, trim: true, default: "" },
    estado: {
      type: String,
      enum: ["PROGRAMADA", "CONFIRMADA", "IMPUGNADA", "CANCELADA"],
      default: "PROGRAMADA",
    },
    confirmada: { type: Boolean, default: false },
    impugnada: { type: Boolean, default: false },
    fechaImpugnacion: { type: Date },
    activo: { type: Boolean, default: true },
  },
  { timestamps: true }
);

CitaSchema.index({ sorteoId: 1, fechaCita: -1 });
CitaSchema.index({ peritoId: 1, fechaCita: -1 });
CitaSchema.index({ estado: 1 });

export default mongoose.model<ICita>("Cita", CitaSchema);
