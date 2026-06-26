import CajaOficina, { ICajaOficina } from "../models/CajaOficina";

export async function findAll(query: {
  desde?: string;
  hasta?: string;
  tipoMovimiento?: string;
  peritoId?: string;
} = {}): Promise<ICajaOficina[]> {
  const filter: Record<string, unknown> = { activo: true };
  if (query.tipoMovimiento) filter.tipoMovimiento = query.tipoMovimiento;
  if (query.peritoId) filter.peritoId = query.peritoId;
  if (query.desde || query.hasta) {
    filter.fecha = {};
    if (query.desde) (filter.fecha as Record<string, unknown>).$gte = new Date(query.desde);
    if (query.hasta) (filter.fecha as Record<string, unknown>).$lte = new Date(query.hasta);
  }
  return CajaOficina.find(filter)
    .populate("registradoPor", "name email")
    .populate("peritoId", "nombres apellidos")
    .populate("sorteoId", "numeroJuicio")
    .sort({ fecha: -1 });
}

export async function findById(id: string): Promise<ICajaOficina | null> {
  return CajaOficina.findById(id)
    .populate("registradoPor", "name email")
    .populate("peritoId", "nombres apellidos");
}

export async function create(data: Partial<ICajaOficina>): Promise<ICajaOficina> {
  const movimiento = new CajaOficina(data);
  return movimiento.save();
}

export async function update(id: string, data: Partial<ICajaOficina>): Promise<ICajaOficina | null> {
  return CajaOficina.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true });
}

export async function remove(id: string): Promise<ICajaOficina | null> {
  return CajaOficina.findByIdAndUpdate(id, { activo: false }, { new: true });
}

export async function getResumen(): Promise<{ ingresos: number; egresos: number; balance: number }> {
  const [ingresos, egresos] = await Promise.all([
    CajaOficina.aggregate([
      { $match: { activo: true, tipoMovimiento: "INGRESO" } },
      { $group: { _id: null, total: { $sum: "$monto" } } },
    ]),
    CajaOficina.aggregate([
      { $match: { activo: true, tipoMovimiento: "EGRESO" } },
      { $group: { _id: null, total: { $sum: "$monto" } } },
    ]),
  ]);
  const totalIngresos = ingresos[0]?.total || 0;
  const totalEgresos = egresos[0]?.total || 0;
  return { ingresos: totalIngresos, egresos: totalEgresos, balance: totalIngresos - totalEgresos };
}
