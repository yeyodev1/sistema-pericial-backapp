import mongoose, { Schema, Document } from "mongoose";

export interface ILiquidacionDetalle {
  sorteoId: mongoose.Types.ObjectId;
  honorarios: number;
  descuentos: number;
}

export interface ILiquidacion extends Document {
  peritoId: mongoose.Types.ObjectId;
  periodo: string;
  fechaInicio: Date;
  fechaFin: Date;
  detalle: ILiquidacionDetalle[];
  totalHonorarios: number;
  totalDescuentos: number;
  totalAPagar: number;
  estado: "PENDIENTE" | "APROBADA" | "PAGADA" | "RECHAZADA";
  observaciones: string;
  activo: boolean;
}

const LiquidacionDetalleSchema = new Schema<ILiquidacionDetalle>(
  {
    sorteoId: { type: Schema.Types.ObjectId, ref: "Sorteo", required: true },
    honorarios: { type: Number, required: true, min: 0 },
    descuentos: { type: Number, required: true, min: 0, default: 0 },
  },
  { _id: false }
);

const LiquidacionSchema = new Schema<ILiquidacion>(
  {
    peritoId: { type: Schema.Types.ObjectId, ref: "Perito", required: true },
    periodo: { type: String, required: true, trim: true },
    fechaInicio: { type: Date, required: true },
    fechaFin: { type: Date, required: true },
    detalle: { type: [LiquidacionDetalleSchema], default: [] },
    totalHonorarios: { type: Number, required: true, min: 0 },
    totalDescuentos: { type: Number, required: true, min: 0, default: 0 },
    totalAPagar: { type: Number, required: true, min: 0 },
    estado: {
      type: String,
      enum: ["PENDIENTE", "APROBADA", "PAGADA", "RECHAZADA"],
      default: "PENDIENTE",
    },
    observaciones: { type: String, default: "" },
    activo: { type: Boolean, default: true },
  },
  { timestamps: true }
);

LiquidacionSchema.index({ peritoId: 1, periodo: 1 });
LiquidacionSchema.index({ fechaInicio: -1 });

export default mongoose.model<ILiquidacion>("Liquidacion", LiquidacionSchema);
