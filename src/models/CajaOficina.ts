import mongoose, { Schema, Document } from "mongoose";

export interface ICajaOficina extends Document {
  fecha: Date;
  tipoMovimiento: "INGRESO" | "EGRESO";
  monto: number;
  concepto: string;
  peritoId?: mongoose.Types.ObjectId;
  sorteoId?: mongoose.Types.ObjectId;
  formaPago: "EFECTIVO" | "TRANSFERENCIA" | "CHEQUE" | "TARJETA";
  referencia: string;
  registradoPor: mongoose.Types.ObjectId;
  observaciones: string;
  activo: boolean;
}

const CajaOficinaSchema = new Schema<ICajaOficina>(
  {
    fecha: { type: Date, required: true, default: Date.now },
    tipoMovimiento: {
      type: String,
      enum: ["INGRESO", "EGRESO"],
      required: true,
    },
    monto: { type: Number, required: true, min: 0 },
    concepto: { type: String, required: true, trim: true },
    peritoId: { type: Schema.Types.ObjectId, ref: "Perito" },
    sorteoId: { type: Schema.Types.ObjectId, ref: "Sorteo" },
    formaPago: {
      type: String,
      enum: ["EFECTIVO", "TRANSFERENCIA", "CHEQUE", "TARJETA"],
      default: "EFECTIVO",
    },
    referencia: { type: String, default: "" },
    registradoPor: { type: Schema.Types.ObjectId, ref: "User", required: true },
    observaciones: { type: String, default: "" },
    activo: { type: Boolean, default: true },
  },
  { timestamps: true }
);

CajaOficinaSchema.index({ fecha: -1 });
CajaOficinaSchema.index({ peritoId: 1 });

export default mongoose.model<ICajaOficina>("CajaOficina", CajaOficinaSchema);
