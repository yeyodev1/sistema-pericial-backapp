import BitacoraCobro, { IBitacoraCobro } from "../models/BitacoraCobro";

export async function findAll(query: {
  sorteoId?: string;
  cobradorId?: string;
} = {}): Promise<IBitacoraCobro[]> {
  const filter: Record<string, unknown> = { activo: true };
  if (query.sorteoId) filter.sorteoId = query.sorteoId;
  if (query.cobradorId) filter.cobradorId = query.cobradorId;
  return BitacoraCobro.find(filter)
    .populate("cobradorId", "name email")
    .populate("sorteoId", "numeroJuicio actor demandado")
    .sort({ fecha: -1 });
}

export async function findById(id: string): Promise<IBitacoraCobro | null> {
  return BitacoraCobro.findById(id)
    .populate("cobradorId", "name email")
    .populate("sorteoId", "numeroJuicio actor demandado");
}

export async function create(data: Partial<IBitacoraCobro>): Promise<IBitacoraCobro> {
  const registro = new BitacoraCobro(data);
  return registro.save();
}

export async function update(id: string, data: Partial<IBitacoraCobro>): Promise<IBitacoraCobro | null> {
  return BitacoraCobro.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true });
}

export async function remove(id: string): Promise<IBitacoraCobro | null> {
  return BitacoraCobro.findByIdAndUpdate(id, { activo: false }, { new: true });
}
