import mongoose, { Schema, Document } from "mongoose";

export type TipoDiligencia = "NOTIFICACION" | "INSPECCION" | "RECEPCION" | "ENTREGA_INFORME" | "COBRO";
export type EstadoDiligencia = "PROGRAMADA" | "EN_CURSO" | "REALIZADA" | "CANCELADA";

export interface IAgendaCampo extends Document {
  sorteoId: mongoose.Types.ObjectId;
  peritoId: mongoose.Types.ObjectId;
  cobradorId?: mongoose.Types.ObjectId;
  fechaHora: Date;
  tipoDiligencia: TipoDiligencia;
  direccion: string;
  latitud?: number;
  longitud?: number;
  estado: EstadoDiligencia;
  observaciones: string;
  activo: boolean;
}

const AgendaCampoSchema = new Schema<IAgendaCampo>(
  {
    sorteoId: { type: Schema.Types.ObjectId, ref: "Sorteo", required: true },
    peritoId: { type: Schema.Types.ObjectId, ref: "Perito", required: true },
    cobradorId: { type: Schema.Types.ObjectId, ref: "User" },
    fechaHora: { type: Date, required: true },
    tipoDiligencia: {
      type: String,
      enum: ["NOTIFICACION", "INSPECCION", "RECEPCION", "ENTREGA_INFORME", "COBRO"],
      required: true,
    },
    direccion: { type: String, required: true, trim: true },
    latitud: { type: Number },
    longitud: { type: Number },
    estado: {
      type: String,
      enum: ["PROGRAMADA", "EN_CURSO", "REALIZADA", "CANCELADA"],
      default: "PROGRAMADA",
    },
    observaciones: { type: String, default: "" },
    activo: { type: Boolean, default: true },
  },
  { timestamps: true }
);

AgendaCampoSchema.index({ peritoId: 1, fechaHora: -1 });
AgendaCampoSchema.index({ sorteoId: 1 });
AgendaCampoSchema.index({ estado: 1 });

export default mongoose.model<IAgendaCampo>("AgendaCampo", AgendaCampoSchema);
