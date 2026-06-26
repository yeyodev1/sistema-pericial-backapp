import mongoose, { Schema, Document } from "mongoose";

export interface IJuzgado extends Document {
  nombre: string;
  direccion?: string;
  ciudad?: string;
  zona?: "CENTRO" | "NORTE" | "SUR" | "OTRO";
  isActive: boolean;
}

const JuzgadoSchema = new Schema<IJuzgado>(
  {
    nombre: { type: String, required: true, trim: true },
    direccion: { type: String, trim: true },
    ciudad: { type: String, trim: true },
    zona: {
      type: String,
      enum: ["CENTRO", "NORTE", "SUR", "OTRO"],
      default: "OTRO",
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<IJuzgado>("Juzgado", JuzgadoSchema);
