import mongoose, { Schema, Document } from "mongoose";

export interface ICliente extends Document {
  nombre: string;
  ruc?: string;
  direccion?: string;
  contactos?: { nombre?: string; telefono?: string; email?: string }[];
  tipo: "BANCO" | "EMPRESA" | "PARTICULAR";
  isActive: boolean;
}

const ClienteSchema = new Schema<ICliente>(
  {
    nombre: { type: String, required: true, trim: true },
    ruc: { type: String, trim: true },
    direccion: { type: String, trim: true },
    contactos: [
      {
        nombre: { type: String, trim: true },
        telefono: { type: String, trim: true },
        email: { type: String, trim: true, lowercase: true },
      },
    ],
    tipo: {
      type: String,
      enum: ["BANCO", "EMPRESA", "PARTICULAR"],
      default: "EMPRESA",
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<ICliente>("Cliente", ClienteSchema);
