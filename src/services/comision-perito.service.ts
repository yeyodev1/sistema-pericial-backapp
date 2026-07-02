import Factura from "../models/Factura";

export interface ComisionPeritoRow {
  _id: string;
  peritoId: string;
  peritoNombre: string;
  peritoRuc: string;
  sorteoId?: string;
  proceso?: string;
  fechaFactura: Date;
  fechaDesignacion?: Date;
  factura: string;
  razonSocial: string;
  ruc: string;
  baseImponible: number;
  iva: number;
  total: number;
  retencion?: string;
  retencionFuente: number;
  retencionIva: number;
  totalCobrado: number;
  estadoCobro?: string;
  medioPago?: string;
  fechaCancelacion?: Date;
  fechaLiquidacion?: Date;
  valorFacturado: number;
}

export async function findAll(query: {
  peritoId?: string;
  clienteId?: string;
  estadoCobro?: string;
  desde?: string;
  hasta?: string;
  search?: string;
} = {}): Promise<ComisionPeritoRow[]> {
  const filter: Record<string, unknown> = { activo: true };
  if (query.peritoId) filter.peritoId = query.peritoId;
  if (query.estadoCobro) filter.estadoCobro = query.estadoCobro;
  if (query.search) {
    filter.$or = [
      { numeroFactura: { $regex: query.search, $options: "i" } },
      { clienteNombre: { $regex: query.search, $options: "i" } },
      { clienteRuc: { $regex: query.search, $options: "i" } },
    ];
  }
  if (query.desde || query.hasta) {
    filter.fechaEmision = {};
    if (query.desde) (filter.fechaEmision as Record<string, unknown>).$gte = new Date(query.desde);
    if (query.hasta) (filter.fechaEmision as Record<string, unknown>).$lte = new Date(query.hasta);
  }

  const facturas = await Factura.find(filter)
    .populate("peritoId", "codigoRegistro nombres apellidos ruc")
    .populate("sorteoId", "numeroJuicio proceso fechaDesignacion")
    .sort({ fechaEmision: -1 });

  return facturas
    .filter((factura) => {
      if (query.clienteId && String(factura.clienteId || "") !== query.clienteId) return false;
      return true;
    })
    .map((factura) => {
      const facturaData = factura as unknown as {
        _id: { toString(): string } | string;
        numeroFactura: string;
        clienteNombre: string;
        clienteRuc: string;
        fechaEmision: Date;
        subtotal?: number;
        baseImponible?: number;
        iva?: number;
        total?: number;
        retencion?: string;
        retencionFuente?: number;
        retencionIva?: number;
        totalCobrado?: number;
        estadoCobro?: string;
        medioPago?: string;
        fechaCancelacion?: Date;
        fechaLiquidacion?: Date;
        valorFacturado?: number;
        peritoId?: { _id: string; codigoRegistro?: string; nombres: string; apellidos: string; ruc: string } | string;
        sorteoId?: { _id: string; proceso?: string; fechaDesignacion?: Date } | string;
      };
      const perito = typeof facturaData.peritoId === "object" ? facturaData.peritoId : undefined;
      const sorteo = typeof facturaData.sorteoId === "object" ? facturaData.sorteoId : undefined;
      return {
        _id: String(facturaData._id),
        peritoId: perito ? String(perito._id) : String(facturaData.peritoId),
        peritoNombre: perito ? `${perito.codigoRegistro ? `${perito.codigoRegistro} - ` : ""}${perito.nombres} ${perito.apellidos}` : String(facturaData.peritoId),
        peritoRuc: perito?.ruc || "",
        sorteoId: sorteo ? String(sorteo._id) : facturaData.sorteoId ? String(facturaData.sorteoId) : undefined,
        proceso: sorteo?.proceso,
        fechaFactura: facturaData.fechaEmision,
        fechaDesignacion: sorteo?.fechaDesignacion,
        factura: facturaData.numeroFactura,
        razonSocial: facturaData.clienteNombre,
        ruc: facturaData.clienteRuc,
        baseImponible: Number(facturaData.baseImponible ?? facturaData.subtotal ?? 0),
        iva: Number(facturaData.iva ?? 0),
        total: Number(facturaData.total ?? 0),
        retencion: facturaData.retencion,
        retencionFuente: Number(facturaData.retencionFuente ?? 0),
        retencionIva: Number(facturaData.retencionIva ?? 0),
        totalCobrado: Number(facturaData.totalCobrado ?? facturaData.total ?? 0),
        estadoCobro: facturaData.estadoCobro,
        medioPago: facturaData.medioPago,
        fechaCancelacion: facturaData.fechaCancelacion,
        fechaLiquidacion: facturaData.fechaLiquidacion,
        valorFacturado: Number(facturaData.valorFacturado ?? facturaData.total ?? 0),
      };
    });
}
