import mongoose, { Schema, Document } from "mongoose";

export interface IFactura extends Document {
  numeroFactura: string;
  sorteoId?: mongoose.Types.ObjectId;
  peritoId: mongoose.Types.ObjectId;
  clienteId?: mongoose.Types.ObjectId;
  clienteNombre: string;
  clienteRuc: string;
  fechaEmision: Date;
  subtotal: number;
  iva: number;
  total: number;
  baseImponible?: number;
  retencion?: string;
  retencionFuente?: number;
  retencionIva?: number;
  totalCobrado?: number;
  estadoCobro?: string;
  medioPago?: string;
  fechaCancelacion?: Date;
  fechaLiquidacion?: Date;
  valorFacturado?: number;
  estado: "POR_FACTURAR" | "EMITIDA" | "AUTORIZADA" | "RECHAZADA";
  observaciones: string;
  activo: boolean;
}

const FacturaSchema = new Schema<IFactura>(
  {
    numeroFactura: { type: String, required: true, unique: true, trim: true },
    sorteoId: { type: Schema.Types.ObjectId, ref: "Sorteo" },
    peritoId: { type: Schema.Types.ObjectId, ref: "Perito", required: true },
    clienteId: { type: Schema.Types.ObjectId, ref: "Cliente" },
    clienteNombre: { type: String, required: true, trim: true },
    clienteRuc: { type: String, required: true, trim: true },
    fechaEmision: { type: Date, required: true, default: Date.now },
    subtotal: { type: Number, required: true, min: 0 },
    iva: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
    baseImponible: { type: Number, min: 0 },
    retencion: { type: String, trim: true },
    retencionFuente: { type: Number, min: 0 },
    retencionIva: { type: Number, min: 0 },
    totalCobrado: { type: Number, min: 0 },
    estadoCobro: { type: String, trim: true },
    medioPago: { type: String, trim: true },
    fechaCancelacion: { type: Date },
    fechaLiquidacion: { type: Date },
    valorFacturado: { type: Number, min: 0 },
    estado: {
      type: String,
      enum: ["POR_FACTURAR", "EMITIDA", "AUTORIZADA", "RECHAZADA"],
      default: "POR_FACTURAR",
    },
    observaciones: { type: String, default: "" },
    activo: { type: Boolean, default: true },
  },
  { timestamps: true }
);

FacturaSchema.index({ numeroFactura: 1 });
FacturaSchema.index({ peritoId: 1 });
FacturaSchema.index({ fechaEmision: -1 });

export default mongoose.model<IFactura>("Factura", FacturaSchema);
