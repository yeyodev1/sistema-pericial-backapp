import mongoose, { Schema, Document } from "mongoose";

export interface IConfiguracion extends Document {
  key: string;
  data: Record<string, unknown>;
  activo: boolean;
}

const ConfiguracionSchema = new Schema<IConfiguracion>(
  {
    key: { type: String, required: true, unique: true, trim: true },
    data: { type: Schema.Types.Mixed, required: true },
    activo: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<IConfiguracion>("Configuracion", ConfiguracionSchema);
