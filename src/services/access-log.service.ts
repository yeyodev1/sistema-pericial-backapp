import AccessLog, { IAccessLog } from "../models/AccessLog";

export async function findAll(query: {
  email?: string;
  accion?: string;
  desde?: string;
  hasta?: string;
  limit?: number;
} = {}): Promise<IAccessLog[]> {
  const filter: Record<string, unknown> = {};
  if (query.email) filter.email = { $regex: query.email, $options: "i" };
  if (query.accion) filter.accion = query.accion;
  if (query.desde || query.hasta) {
    filter.createdAt = {};
    if (query.desde) (filter.createdAt as Record<string, unknown>).$gte = new Date(query.desde);
    if (query.hasta) (filter.createdAt as Record<string, unknown>).$lte = new Date(query.hasta);
  }
  return AccessLog.find(filter)
    .populate("userId", "name email")
    .sort({ createdAt: -1 })
    .limit(query.limit || 200);
}

export async function create(data: Partial<IAccessLog>): Promise<IAccessLog> {
  const log = new AccessLog(data);
  return log.save();
}

export async function getFailedAttempts(email: string, minutes: number): Promise<number> {
  const since = new Date(Date.now() - minutes * 60 * 1000);
  return AccessLog.countDocuments({
    email: email.toLowerCase(),
    accion: "LOGIN_FAILED",
    createdAt: { $gte: since },
  });
}
