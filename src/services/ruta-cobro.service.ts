import Factura from "../models/Factura";
import Sorteo from "../models/Sorteo";

export interface RutaCobroRow {
  _id: string;
  cliente: string;
  banco: string;
  abogado: string;
  direccion: string;
  direccion2: string;
  codSorteo: string;
  fechaDesignacion?: Date;
  proceso?: string;
  perito?: { _id: string; nombres: string; apellidos: string; codigoRegistro?: string } | string;
  valor: number;
  numFactura?: string;
  numFacturaCobro?: string;
  observacion?: string;
  comentario?: string;
  fechaEntrega?: Date;
  entregado: boolean;
  fechaEntregaReal?: Date;
  sorteoId: string;
}

export async function findAll(query: {
  peritoId?: string;
  clienteId?: string;
  search?: string;
  desde?: string;
  hasta?: string;
  mostrarDia?: boolean;
  soloEntregadas?: boolean;
} = {}): Promise<RutaCobroRow[]> {
  const filter: Record<string, unknown> = { activo: true };

  if (query.peritoId) filter.peritoId = query.peritoId;
  if (query.search) {
    filter.$or = [
      { numeroJuicio: { $regex: query.search, $options: "i" } },
      { actor: { $regex: query.search, $options: "i" } },
      { demandado: { $regex: query.search, $options: "i" } },
      { proceso: { $regex: query.search, $options: "i" } },
    ];
  }
  if (query.desde || query.hasta) {
    filter.fechaAsignacion = {};
    if (query.desde) (filter.fechaAsignacion as Record<string, unknown>).$gte = new Date(query.desde);
    if (query.hasta) (filter.fechaAsignacion as Record<string, unknown>).$lte = new Date(query.hasta);
  }

  const sorteos = await Sorteo.find(filter)
    .populate("peritoId", "codigoRegistro nombres apellidos ruc")
    .populate("prefactura.clienteId", "nombre ruc tipo")
    .sort({ fechaAsignacion: -1 });

  const sorteoIds = sorteos.map((s) => s._id);
  const facturas = await Factura.find({ activo: true, sorteoId: { $in: sorteoIds } }).sort({ fechaEmision: -1 });
  const facturaBySorteo = new Map<string, (typeof facturas)[number]>();
  facturas.forEach((factura) => {
    if (factura.sorteoId) {
      facturaBySorteo.set(String(factura.sorteoId), factura);
    }
  });

  const rows = sorteos.map((sorteo) => {
    const factura = facturaBySorteo.get(String(sorteo._id));
    const sorteoData = sorteo as unknown as {
      _id: { toString(): string } | string;
      numeroJuicio: string;
      actor?: string;
      dependencia?: string;
      juzgado?: string;
      juez?: string;
      proceso?: string;
      fechaDesignacion?: Date;
      peritoId?: { _id: string; nombres: string; apellidos: string; codigoRegistro?: string } | string;
      prefactura?: { clienteId?: { _id?: string; tipo?: string } | string; clienteNombre?: string; clienteRuc?: string; facturaNo?: string; total?: number; item?: string };
      contacto?: { cliente?: string; estudioJuridico?: string; nombre?: string; direccion?: string };
      cobranza?: { estadoCobranza?: string; observacion?: string; fechaLiquidacion?: Date; fechaCancelacion?: Date };
      fechas?: { fechaEntrega?: Date };
      informacionDemandado?: { observacion?: string };
      observaciones?: string;
    };

    const clienteNombre = sorteoData.prefactura?.clienteNombre || sorteoData.contacto?.cliente || sorteoData.actor || "";
    const clienteRuc = sorteoData.prefactura?.clienteRuc || factura?.clienteRuc || "";
    const clienteTipo = typeof sorteoData.prefactura?.clienteId === "object" ? sorteoData.prefactura?.clienteId?.tipo : undefined;
    const banco = clienteTipo === "BANCO" ? clienteNombre : sorteoData.contacto?.estudioJuridico || "";
    const perito = typeof sorteoData.peritoId === "object" ? sorteoData.peritoId : undefined;

    return {
      _id: String(sorteo._id),
      sorteoId: String(sorteoData._id),
      cliente: clienteNombre,
      banco,
      abogado: sorteoData.contacto?.nombre || sorteoData.juez || "",
      direccion: sorteoData.contacto?.direccion || sorteoData.dependencia || "",
      direccion2: sorteoData.informacionDemandado?.observacion || "",
      codSorteo: sorteoData.numeroJuicio,
      fechaDesignacion: sorteoData.fechaDesignacion || new Date(),
      proceso: sorteoData.proceso,
      perito,
      valor: Number(sorteoData.prefactura?.total ?? factura?.total ?? 0),
      numFactura: factura?.numeroFactura || sorteoData.prefactura?.facturaNo || "",
      numFacturaCobro: sorteoData.prefactura?.facturaNo || factura?.numeroFactura || "",
      observacion: sorteoData.cobranza?.estadoCobranza || sorteoData.observaciones || "",
      comentario: sorteoData.cobranza?.observacion || sorteoData.prefactura?.item || "",
      fechaEntrega: sorteoData.fechas?.fechaEntrega || sorteoData.cobranza?.fechaLiquidacion,
      entregado: Boolean(sorteoData.cobranza?.fechaCancelacion || sorteoData.cobranza?.estadoCobranza?.toUpperCase().includes("ENTREG")),
      fechaEntregaReal: sorteoData.cobranza?.fechaCancelacion || factura?.fechaCancelacion,
    };
  });

  const filtered = rows.filter((row) => {
    if (query.clienteId) {
      const cliente = sorteos.find((s) => String(s._id) === row.sorteoId)?.prefactura?.clienteId;
      const clienteData = typeof cliente === "object" ? (cliente as unknown as { _id?: string }) : { _id: String(cliente || "") };
      if (!clienteData._id || String(clienteData._id) !== query.clienteId) return false;
    }
    if (query.soloEntregadas && !row.entregado) return false;
    if (query.mostrarDia && row.fechaEntrega) {
      const today = new Date();
      const rowDate = new Date(row.fechaEntrega);
      if (rowDate.toDateString() !== today.toDateString()) return false;
    }
    return true;
  });

  return filtered;
}
