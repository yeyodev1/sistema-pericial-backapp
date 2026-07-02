import LiquidacionComision, { ILiquidacionComision } from "../models/LiquidacionComision";

export async function findAll(query: {
  peritoId?: string;
  liquidado?: string;
  desde?: string;
  hasta?: string;
} = {}): Promise<ILiquidacionComision[]> {
  const filter: Record<string, unknown> = { activo: true };

  if (query.peritoId) filter.peritoId = query.peritoId;
  if (query.liquidado === "true") filter.liquidado = true;
  if (query.liquidado === "false") filter.liquidado = false;
  if (query.desde || query.hasta) {
    filter.emision = {};
    if (query.desde) (filter.emision as Record<string, unknown>).$gte = new Date(query.desde);
    if (query.hasta) (filter.emision as Record<string, unknown>).$lte = new Date(query.hasta);
  }

  return LiquidacionComision.find(filter)
    .populate("peritoId", "codigoRegistro nombres apellidos ruc")
    .populate("sorteoId", "numeroJuicio proceso fechaDesignacion")
    .populate("facturaId", "numeroFactura fechaEmision total")
    .sort({ emision: -1 });
}

export async function findById(id: string): Promise<ILiquidacionComision | null> {
  return LiquidacionComision.findById(id)
    .populate("peritoId", "codigoRegistro nombres apellidos ruc")
    .populate("sorteoId", "numeroJuicio proceso fechaDesignacion")
    .populate("facturaId", "numeroFactura fechaEmision total");
}

export async function create(data: Partial<ILiquidacionComision>): Promise<ILiquidacionComision> {
  const liquidacion = new LiquidacionComision(data);
  return liquidacion.save();
}

export async function update(id: string, data: Partial<ILiquidacionComision>): Promise<ILiquidacionComision | null> {
  return LiquidacionComision.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true });
}

export async function remove(id: string): Promise<ILiquidacionComision | null> {
  return LiquidacionComision.findByIdAndUpdate(id, { activo: false }, { new: true });
}

export async function getStats(): Promise<{ totalPendiente: number; totalLiquidado: number; registros: number }> {
  const [pendientes, liquidados, registros] = await Promise.all([
    LiquidacionComision.aggregate([
      { $match: { activo: true, liquidado: false } },
      { $group: { _id: null, total: { $sum: "$valorALiquidar" } } },
    ]),
    LiquidacionComision.aggregate([
      { $match: { activo: true, liquidado: true } },
      { $group: { _id: null, total: { $sum: "$valorALiquidar" } } },
    ]),
    LiquidacionComision.countDocuments({ activo: true }),
  ]);

  return {
    totalPendiente: pendientes[0]?.total || 0,
    totalLiquidado: liquidados[0]?.total || 0,
    registros,
  };
}
