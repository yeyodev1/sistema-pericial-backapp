import Factura, { IFactura } from "../models/Factura";
import { CustomError } from "../errors/customError.error";

export async function findAll(query: {
  estado?: string;
  peritoId?: string;
} = {}): Promise<IFactura[]> {
  const filter: Record<string, unknown> = { activo: true };

  if (query.estado) {
    filter.estado = query.estado;
  }
  if (query.peritoId) {
    filter.peritoId = query.peritoId;
  }

  return Factura.find(filter)
    .populate("peritoId", "nombres apellidos ruc")
    .populate("clienteId", "nombre ruc")
    .sort({ fechaEmision: -1 });
}

export async function findById(id: string): Promise<IFactura | null> {
  return Factura.findById(id)
    .populate("peritoId", "nombres apellidos ruc")
    .populate("clienteId", "nombre ruc");
}

export async function create(data: Partial<IFactura>): Promise<IFactura> {
  const factura = new Factura(data);
  return factura.save();
}

export async function update(
  id: string,
  data: Partial<IFactura>
): Promise<IFactura | null> {
  return Factura.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true });
}

export async function remove(id: string): Promise<IFactura | null> {
  return Factura.findByIdAndUpdate(id, { activo: false }, { new: true });
}

export async function getStats(): Promise<{
  porFacturar: number;
  autorizadas: number;
  rechazadas: number;
}> {
  const [porFacturar, autorizadas, rechazadas] = await Promise.all([
    Factura.countDocuments({ activo: true, estado: "POR_FACTURAR" }),
    Factura.countDocuments({ activo: true, estado: "AUTORIZADA" }),
    Factura.countDocuments({ activo: true, estado: "RECHAZADA" }),
  ]);

  return { porFacturar, autorizadas, rechazadas };
}
