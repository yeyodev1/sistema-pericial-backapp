import mongoose, { Schema, Document, Types } from "mongoose";

export interface ISorteoFechas {
  fechaNotificacion?: Date;
  fechaVencimiento?: Date;
  fechaPosesion?: Date;
  fechaRevision?: Date;
  fechaEntrega?: Date;
}

export interface ISorteoEspecialidad {
  profesion?: string;
  especialidad?: string;
}

export interface ISorteoInformacionDemandado {
  tipoIdentificacion?: string;
  identificacion?: string;
  opAnteriorTarjeta?: string;
  opActualTarjeta?: string;
  observacion?: string;
}

export interface ISorteoPrefactura {
  clienteId?: Types.ObjectId;
  clienteNombre?: string;
  clienteRuc?: string;
  correo?: string;
  item?: string;
  valorBaseImponible?: number;
  iva?: number;
  total?: number;
  retencionIva?: number;
  retencionFuente?: number;
  facturaNo?: string;
  fechaEmisionFactura?: Date;
  retencionNo?: string;
  serie?: string;
}

export interface ISorteoCobranza {
  totalCobranza?: number;
  estadoCobranza?: string;
  movilidad?: number;
  adicional?: number;
  medioPago?: string;
  cuentaBancaria?: string;
  fechaLiquidacion?: Date;
  fechaCancelacion?: Date;
  observacion?: string;
}

export interface ISorteoContacto {
  estudioJuridico?: string;
  cliente?: string;
  nombre?: string;
  direccion?: string;
  telefono?: string;
  correo?: string;
  observacion?: string;
}

export interface ISorteoImpugnacion {
  estado?: string;
  fecha?: Date;
  fechaNotificacion?: Date;
  fechaVencimiento?: Date;
  fechaRevision?: Date;
  fechaEntrega?: Date;
  fechaConfirmacion?: Date;
  observacion?: string;
}

export interface ISorteo extends Document {
  numeroJuicio: string;
  actor: string;
  demandado: string;
  tipoMateria: string;
  estado: string;
  fechaAsignacion: Date;
  fechaDesignacion?: Date;
  fechaResolucion?: Date;
  dependencia?: string;
  ciudad?: string;
  juzgado: string;
  juez: string;
  peritoId?: mongoose.Types.ObjectId;
  proceso?: string;
  tipoDesignacion?: string;
  accionInfraccion?: string;
  fechas?: ISorteoFechas;
  especialidad?: ISorteoEspecialidad;
  informacionDemandado?: ISorteoInformacionDemandado;
  prefactura?: ISorteoPrefactura;
  cobranza?: ISorteoCobranza;
  contacto?: ISorteoContacto;
  impugnacion?: ISorteoImpugnacion;
  observaciones: string;
  activo: boolean;
}

const sorteoFechaSchema = new Schema<ISorteoFechas>(
  {
    fechaNotificacion: { type: Date },
    fechaVencimiento: { type: Date },
    fechaPosesion: { type: Date },
    fechaRevision: { type: Date },
    fechaEntrega: { type: Date },
  },
  { _id: false }
);

const sorteoEspecialidadSchema = new Schema<ISorteoEspecialidad>(
  {
    profesion: { type: String, trim: true },
    especialidad: { type: String, trim: true },
  },
  { _id: false }
);

const sorteoInformacionDemandadoSchema = new Schema<ISorteoInformacionDemandado>(
  {
    tipoIdentificacion: { type: String, trim: true },
    identificacion: { type: String, trim: true },
    opAnteriorTarjeta: { type: String, trim: true },
    opActualTarjeta: { type: String, trim: true },
    observacion: { type: String, trim: true },
  },
  { _id: false }
);

const sorteoPrefacturaSchema = new Schema<ISorteoPrefactura>(
  {
    clienteId: { type: Schema.Types.ObjectId, ref: "Cliente" },
    clienteNombre: { type: String, trim: true },
    clienteRuc: { type: String, trim: true },
    correo: { type: String, trim: true, lowercase: true },
    item: { type: String, trim: true },
    valorBaseImponible: { type: Number, min: 0 },
    iva: { type: Number, min: 0 },
    total: { type: Number, min: 0 },
    retencionIva: { type: Number, min: 0 },
    retencionFuente: { type: Number, min: 0 },
    facturaNo: { type: String, trim: true },
    fechaEmisionFactura: { type: Date },
    retencionNo: { type: String, trim: true },
    serie: { type: String, trim: true },
  },
  { _id: false }
);

const sorteoCobranzaSchema = new Schema<ISorteoCobranza>(
  {
    totalCobranza: { type: Number, min: 0 },
    estadoCobranza: { type: String, trim: true },
    movilidad: { type: Number, min: 0 },
    adicional: { type: Number, min: 0 },
    medioPago: { type: String, trim: true },
    cuentaBancaria: { type: String, trim: true },
    fechaLiquidacion: { type: Date },
    fechaCancelacion: { type: Date },
    observacion: { type: String, trim: true },
  },
  { _id: false }
);

const sorteoContactoSchema = new Schema<ISorteoContacto>(
  {
    estudioJuridico: { type: String, trim: true },
    cliente: { type: String, trim: true },
    nombre: { type: String, trim: true },
    direccion: { type: String, trim: true },
    telefono: { type: String, trim: true },
    correo: { type: String, trim: true, lowercase: true },
    observacion: { type: String, trim: true },
  },
  { _id: false }
);

const sorteoImpugnacionSchema = new Schema<ISorteoImpugnacion>(
  {
    estado: { type: String, trim: true },
    fecha: { type: Date },
    fechaNotificacion: { type: Date },
    fechaVencimiento: { type: Date },
    fechaRevision: { type: Date },
    fechaEntrega: { type: Date },
    fechaConfirmacion: { type: Date },
    observacion: { type: String, trim: true },
  },
  { _id: false }
);

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
    fechaDesignacion: { type: Date },
    fechaResolucion: { type: Date },
    dependencia: { type: String, trim: true },
    ciudad: { type: String, trim: true },
    juzgado: { type: String, required: true, trim: true },
    juez: { type: String, required: true, trim: true },
    peritoId: {
      type: Schema.Types.ObjectId,
      ref: "Perito",
    },
    proceso: { type: String, trim: true },
    tipoDesignacion: { type: String, trim: true },
    accionInfraccion: { type: String, trim: true },
    fechas: { type: sorteoFechaSchema, default: {} },
    especialidad: { type: sorteoEspecialidadSchema, default: {} },
    informacionDemandado: { type: sorteoInformacionDemandadoSchema, default: {} },
    prefactura: { type: sorteoPrefacturaSchema, default: {} },
    cobranza: { type: sorteoCobranzaSchema, default: {} },
    contacto: { type: sorteoContactoSchema, default: {} },
    impugnacion: { type: sorteoImpugnacionSchema, default: {} },
    observaciones: { type: String, default: "" },
    activo: { type: Boolean, default: true },
  },
  { timestamps: true }
);

SorteoSchema.index({ numeroJuicio: "text", actor: "text", demandado: "text" });
SorteoSchema.index({ estado: 1 });
SorteoSchema.index({ fechaAsignacion: -1 });

export default mongoose.model<ISorteo>("Sorteo", SorteoSchema);
