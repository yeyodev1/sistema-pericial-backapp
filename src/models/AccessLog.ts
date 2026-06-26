import mongoose, { Schema, Document } from "mongoose";

export interface IAccessLog extends Document {
  userId?: mongoose.Types.ObjectId;
  email: string;
  ip: string;
  accion: "LOGIN" | "LOGIN_FAILED" | "LOGOUT" | "ACCESS_BLOCKED";
  resultado: "EXITOSO" | "FALLIDO" | "BLOQUEADO";
  activo: boolean;
}

const AccessLogSchema = new Schema<IAccessLog>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    email: { type: String, required: true, lowercase: true, trim: true },
    ip: { type: String, required: true },
    accion: {
      type: String,
      enum: ["LOGIN", "LOGIN_FAILED", "LOGOUT", "ACCESS_BLOCKED"],
      required: true,
    },
    resultado: {
      type: String,
      enum: ["EXITOSO", "FALLIDO", "BLOQUEADO"],
      required: true,
    },
    activo: { type: Boolean, default: true },
  },
  { timestamps: true }
);

AccessLogSchema.index({ email: 1, createdAt: -1 });
AccessLogSchema.index({ accion: 1 });

export default mongoose.model<IAccessLog>("AccessLog", AccessLogSchema);
