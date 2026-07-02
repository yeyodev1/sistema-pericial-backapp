import mongoose, { Schema, Document } from "mongoose";

export interface ILiquidacionComision extends Document {
  sorteoId?: mongoose.Types.ObjectId;
  peritoId: mongoose.Types.ObjectId;
  facturaId?: mongoose.Types.ObjectId;
  clienteId?: mongoose.Types.ObjectId;
  clienteNombre: string;
  clienteRuc: string;
  proceso?: string;
  emision: Date;
  factura: string;
  valor: number;
  numeroFacturaPerito?: number;
  porcentajeFacturacion?: number;
  porcentajeComision?: number;
  valorComision?: number;
  liquidado: boolean;
  fechaLiquidacion?: Date;
  valorALiquidar?: number;
  caja?: string;
  motivo?: string;
  estadoCobro?: string;
  medioPago?: string;
  observaciones?: string;
  activo: boolean;
}

const LiquidacionComisionSchema = new Schema<ILiquidacionComision>(
  {
    sorteoId: { type: Schema.Types.ObjectId, ref: "Sorteo" },
    peritoId: { type: Schema.Types.ObjectId, ref: "Perito", required: true },
    facturaId: { type: Schema.Types.ObjectId, ref: "Factura" },
    clienteId: { type: Schema.Types.ObjectId, ref: "Cliente" },
    clienteNombre: { type: String, required: true, trim: true },
    clienteRuc: { type: String, required: true, trim: true },
    proceso: { type: String, trim: true },
    emision: { type: Date, required: true, default: Date.now },
    factura: { type: String, required: true, trim: true },
    valor: { type: Number, required: true, min: 0 },
    numeroFacturaPerito: { type: Number, default: 0, min: 0 },
    porcentajeFacturacion: { type: Number, default: 0, min: 0 },
    porcentajeComision: { type: Number, default: 0, min: 0 },
    valorComision: { type: Number, default: 0, min: 0 },
    liquidado: { type: Boolean, default: false },
    fechaLiquidacion: { type: Date },
    valorALiquidar: { type: Number, default: 0, min: 0 },
    caja: { type: String, trim: true },
    motivo: { type: String, trim: true },
    estadoCobro: { type: String, trim: true },
    medioPago: { type: String, trim: true },
    observaciones: { type: String, trim: true, default: "" },
    activo: { type: Boolean, default: true },
  },
  { timestamps: true }
);

LiquidacionComisionSchema.index({ peritoId: 1, emision: -1 });
LiquidacionComisionSchema.index({ facturaId: 1 });
LiquidacionComisionSchema.index({ liquidado: 1 });

export default mongoose.model<ILiquidacionComision>("LiquidacionComision", LiquidacionComisionSchema);
