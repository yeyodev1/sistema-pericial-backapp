import Cita, { ICita } from "../models/Cita";

export async function findAll(query: {
  sorteoId?: string;
  peritoId?: string;
  estado?: string;
  search?: string;
  desde?: string;
  hasta?: string;
} = {}): Promise<ICita[]> {
  const filter: Record<string, unknown> = { activo: true };

  if (query.sorteoId) filter.sorteoId = query.sorteoId;
  if (query.peritoId) filter.peritoId = query.peritoId;
  if (query.estado) filter.estado = query.estado;
  if (query.search) {
    filter.$or = [
      { lugarCita: { $regex: query.search, $options: "i" } },
      { observacion: { $regex: query.search, $options: "i" } },
    ];
  }
  if (query.desde || query.hasta) {
    filter.fechaCita = {};
    if (query.desde) (filter.fechaCita as Record<string, unknown>).$gte = new Date(query.desde);
    if (query.hasta) (filter.fechaCita as Record<string, unknown>).$lte = new Date(query.hasta);
  }

  return Cita.find(filter)
    .populate("sorteoId", "numeroJuicio actor demandado proceso fechaAsignacion fechas impugnacion")
    .populate("peritoId", "codigoRegistro nombres apellidos ruc")
    .sort({ fechaCita: -1 });
}

export async function findById(id: string): Promise<ICita | null> {
  return Cita.findById(id)
    .populate("sorteoId", "numeroJuicio actor demandado proceso fechaAsignacion fechas impugnacion")
    .populate("peritoId", "codigoRegistro nombres apellidos ruc");
}

export async function create(data: Partial<ICita>): Promise<ICita> {
  const cita = new Cita(data);
  return cita.save();
}

export async function update(id: string, data: Partial<ICita>): Promise<ICita | null> {
  return Cita.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true });
}

export async function remove(id: string): Promise<ICita | null> {
  return Cita.findByIdAndUpdate(id, { activo: false }, { new: true });
}

export async function getStats(): Promise<{ programadas: number; confirmadas: number; impugnadas: number; canceladas: number }> {
  const [programadas, confirmadas, impugnadas, canceladas] = await Promise.all([
    Cita.countDocuments({ activo: true, estado: "PROGRAMADA" }),
    Cita.countDocuments({ activo: true, estado: "CONFIRMADA" }),
    Cita.countDocuments({ activo: true, estado: "IMPUGNADA" }),
    Cita.countDocuments({ activo: true, estado: "CANCELADA" }),
  ]);

  return { programadas, confirmadas, impugnadas, canceladas };
}
