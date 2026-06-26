import Configuracion, { IConfiguracion } from "../models/Configuracion";
import { CustomError } from "../errors/customError.error";

const CONFIG_KEYS = ["business_hours", "firma_electronica", "smtp"] as const;
type ConfigKey = (typeof CONFIG_KEYS)[number];

export async function getConfig(key: ConfigKey): Promise<Record<string, unknown> | null> {
  const doc = await Configuracion.findOne({ key, activo: true });
  return doc ? (doc.data as Record<string, unknown>) : null;
}

export async function getAllConfigs(): Promise<IConfiguracion[]> {
  return Configuracion.find({ activo: true });
}

export async function upsertConfig(
  key: ConfigKey,
  data: Record<string, unknown>
): Promise<IConfiguracion> {
  const doc = await Configuracion.findOneAndUpdate(
    { key },
    { $set: { data } },
    { upsert: true, new: true }
  );
  return doc;
}
