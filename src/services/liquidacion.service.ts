import Liquidacion, { ILiquidacion } from "../models/Liquidacion";

export async function findAll(query: {
  estado?: string;
  peritoId?: string;
} = {}): Promise<ILiquidacion[]> {
  const filter: Record<string, unknown> = { activo: true };

  if (query.estado) {
    filter.estado = query.estado;
  }
  if (query.peritoId) {
    filter.peritoId = query.peritoId;
  }

  return Liquidacion.find(filter)
    .populate("peritoId", "nombres apellidos ruc")
    .populate("detalle.sorteoId", "numeroJuicio")
    .sort({ fechaInicio: -1 });
}

export async function findById(id: string): Promise<ILiquidacion | null> {
  return Liquidacion.findById(id)
    .populate("peritoId", "nombres apellidos ruc")
    .populate("detalle.sorteoId", "numeroJuicio");
}

export async function create(data: Partial<ILiquidacion>): Promise<ILiquidacion> {
  const liquidacion = new Liquidacion(data);
  return liquidacion.save();
}

export async function update(
  id: string,
  data: Partial<ILiquidacion>
): Promise<ILiquidacion | null> {
  return Liquidacion.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true });
}

export async function remove(id: string): Promise<ILiquidacion | null> {
  return Liquidacion.findByIdAndUpdate(id, { activo: false }, { new: true });
}

export async function getStats(): Promise<{
  totalPendiente: number;
  liquidado: number;
  peritosActivos: number;
}> {
  const [pendientes, pagadas] = await Promise.all([
    Liquidacion.aggregate([
      { $match: { activo: true, estado: { $in: ["PENDIENTE", "APROBADA"] } } },
      { $group: { _id: null, total: { $sum: "$totalAPagar" } } },
    ]),
    Liquidacion.aggregate([
      { $match: { activo: true, estado: "PAGADA" } },
      { $group: { _id: null, total: { $sum: "$totalAPagar" } } },
    ]),
  ]);

  const peritosActivos = await Liquidacion.distinct("peritoId", { activo: true });

  return {
    totalPendiente: pendientes[0]?.total || 0,
    liquidado: pagadas[0]?.total || 0,
    peritosActivos: peritosActivos.length,
  };
}
