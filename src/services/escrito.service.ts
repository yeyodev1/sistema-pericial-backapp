import Escrito, { IEscrito } from "../models/Escrito";

import mongoose from "mongoose";

export async function findAll(query: {
  sorteoId?: string;
  tipo?: string;
  estado?: string;
} = {}): Promise<IEscrito[]> {
  const filter: Record<string, unknown> = { activo: true };
  if (query.sorteoId) filter.sorteoId = query.sorteoId;
  if (query.tipo) filter.tipo = query.tipo;
  if (query.estado) filter.estado = query.estado;
  return Escrito.find(filter)
    .populate("sorteoId", "numeroJuicio materia actor demandado")
    .sort({ fechaPresentacion: -1 });
}

export async function findById(id: string): Promise<IEscrito | null> {
  return Escrito.findById(id).populate("sorteoId", "numeroJuicio materia actor demandado");
}

export async function create(data: Partial<IEscrito>): Promise<IEscrito> {
  const escrito = new Escrito(data);
  return escrito.save();
}

export async function update(id: string, data: Partial<IEscrito>): Promise<IEscrito | null> {
  return Escrito.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true });
}

export async function remove(id: string): Promise<IEscrito | null> {
  return Escrito.findByIdAndUpdate(id, { activo: false }, { new: true });
}

export async function getStatsBySorteo(sorteoId: string): Promise<Record<string, number>> {
  const stats = await Escrito.aggregate([
    { $match: { sorteoId: mongoose.Types.ObjectId.createFromHexString(sorteoId), activo: true } },
    { $group: { _id: "$estado", count: { $sum: 1 } } },
  ]);
  const result: Record<string, number> = {};
  stats.forEach((s: { _id: string; count: number }) => { result[s._id] = s.count; });
  return result;
}
