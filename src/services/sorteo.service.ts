import Sorteo, { ISorteo } from "../models/Sorteo";

export async function findAll(
  query: { search?: string; estado?: string } = {}
): Promise<ISorteo[]> {
  const filter: Record<string, unknown> = { activo: true };

  if (query.estado) {
    filter.estado = query.estado;
  }

  if (query.search) {
    filter.$text = { $search: query.search };
  }

  return Sorteo.find(filter)
    .populate("peritoId", "nombres apellidos ruc")
    .sort({ fechaAsignacion: -1 });
}

export async function findById(id: string): Promise<ISorteo | null> {
  return Sorteo.findById(id).populate("peritoId", "nombres apellidos ruc");
}

export async function create(
  data: Partial<ISorteo>
): Promise<ISorteo> {
  const sorteo = new Sorteo(data);
  return sorteo.save();
}

export async function update(
  id: string,
  data: Partial<ISorteo>
): Promise<ISorteo | null> {
  return Sorteo.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true });
}

export async function remove(id: string): Promise<ISorteo | null> {
  return Sorteo.findByIdAndUpdate(id, { activo: false }, { new: true });
}

export async function getDashboardStats(): Promise<{
  total: number;
  asignados: number;
  enProceso: number;
  cerrados: number;
}> {
  const [total, asignados, enProceso, cerrados] = await Promise.all([
    Sorteo.countDocuments({ activo: true }),
    Sorteo.countDocuments({ activo: true, estado: "ASIGNADO" }),
    Sorteo.countDocuments({ activo: true, estado: "EN_PROCESO" }),
    Sorteo.countDocuments({ activo: true, estado: "CERRADO" }),
  ]);

  return { total, asignados, enProceso, cerrados };
}
