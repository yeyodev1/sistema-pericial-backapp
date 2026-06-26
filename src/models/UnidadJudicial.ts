import mongoose, { Schema, Document, Types } from "mongoose";

export interface IUnidadJudicial extends Document {
  nombre: string;
  juzgadoId?: Types.ObjectId;
  direccion?: string;
  ciudad?: string;
  zona?: "CENTRO" | "NORTE" | "SUR" | "OTRO";
  isActive: boolean;
}

const UnidadJudicialSchema = new Schema<IUnidadJudicial>(
  {
    nombre: { type: String, required: true, trim: true },
    juzgadoId: { type: Schema.Types.ObjectId, ref: "Juzgado" },
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

export default mongoose.model<IUnidadJudicial>(
  "UnidadJudicial",
  UnidadJudicialSchema
);
