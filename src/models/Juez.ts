import mongoose, { Schema, Document } from "mongoose";

export interface IJuez extends Document {
  nombres: string;
  apellidos: string;
  email?: string;
  telefono?: string;
  isActive: boolean;
}

const JuezSchema = new Schema<IJuez>(
  {
    nombres: { type: String, required: true, trim: true },
    apellidos: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    telefono: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<IJuez>("Juez", JuezSchema);
