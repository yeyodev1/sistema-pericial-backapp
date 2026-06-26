import AgendaCampo, { IAgendaCampo } from "../models/AgendaCampo";

export async function findAll(query: {
  peritoId?: string;
  estado?: string;
  desde?: string;
  hasta?: string;
} = {}): Promise<IAgendaCampo[]> {
  const filter: Record<string, unknown> = { activo: true };
  if (query.peritoId) filter.peritoId = query.peritoId;
  if (query.estado) filter.estado = query.estado;
  if (query.desde || query.hasta) {
    filter.fechaHora = {};
    if (query.desde) (filter.fechaHora as Record<string, unknown>).$gte = new Date(query.desde);
    if (query.hasta) (filter.fechaHora as Record<string, unknown>).$lte = new Date(query.hasta);
  }
  return AgendaCampo.find(filter)
    .populate("peritoId", "nombres apellidos")
    .populate("sorteoId", "numeroJuicio materia actor demandado")
    .populate("cobradorId", "name email")
    .sort({ fechaHora: 1 });
}

export async function findById(id: string): Promise<IAgendaCampo | null> {
  return AgendaCampo.findById(id)
    .populate("peritoId", "nombres apellidos")
    .populate("sorteoId", "numeroJuicio materia actor demandado")
    .populate("cobradorId", "name email");
}

export async function create(data: Partial<IAgendaCampo>): Promise<IAgendaCampo> {
  const diligencia = new AgendaCampo(data);
  return diligencia.save();
}

export async function update(id: string, data: Partial<IAgendaCampo>): Promise<IAgendaCampo | null> {
  return AgendaCampo.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true });
}

export async function remove(id: string): Promise<IAgendaCampo | null> {
  return AgendaCampo.findByIdAndUpdate(id, { activo: false }, { new: true });
}

export async function getStats(): Promise<Record<string, number>> {
  const stats = await AgendaCampo.aggregate([
    { $match: { activo: true } },
    { $group: { _id: "$estado", count: { $sum: 1 } } },
  ]);
  const result: Record<string, number> = {};
  stats.forEach((s: { _id: string; count: number }) => { result[s._id] = s.count; });
  return result;
}
