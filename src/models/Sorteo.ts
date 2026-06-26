import mongoose, { Schema, Document } from "mongoose";

export interface ISorteo extends Document {
  numeroJuicio: string;
  actor: string;
  demandado: string;
  tipoMateria: string;
  estado: string;
  fechaAsignacion: Date;
  fechaResolucion?: Date;
  juzgado: string;
  juez: string;
  peritoId?: mongoose.Types.ObjectId;
  observaciones: string;
  activo: boolean;
}

const SorteoSchema = new Schema<ISorteo>(
  {
    numeroJuicio: { type: String, required: true, trim: true },
    actor: { type: String, required: true, trim: true },
    demandado: { type: String, required: true, trim: true },
    tipoMateria: { type: String, required: true, trim: true },
    estado: {
      type: String,
      enum: [
        "ASIGNADO",
        "EN_PROCESO",
        "DILIGENCIA_PROGRAMADA",
        "INFORME_ENTREGADO",
        "FACTURADO",
        "CERRADO",
      ],
      default: "ASIGNADO",
    },
    fechaAsignacion: { type: Date, required: true, default: Date.now },
    fechaResolucion: { type: Date },
    juzgado: { type: String, required: true, trim: true },
    juez: { type: String, required: true, trim: true },
    peritoId: {
      type: Schema.Types.ObjectId,
      ref: "Perito",
    },
    observaciones: { type: String, default: "" },
    activo: { type: Boolean, default: true },
  },
  { timestamps: true }
);

SorteoSchema.index({ numeroJuicio: "text", actor: "text", demandado: "text" });
SorteoSchema.index({ estado: 1 });
SorteoSchema.index({ fechaAsignacion: -1 });

export default mongoose.model<ISorteo>("Sorteo", SorteoSchema);
