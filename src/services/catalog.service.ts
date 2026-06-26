import { Model } from "mongoose";
import { CustomError } from "../errors/customError.error";

export async function findAll(model: Model<any>, filters: Record<string, unknown> = {}) {
  return model.find({ isActive: true, ...filters }).sort({ createdAt: -1 });
}

export async function findById(model: Model<any>, id: string) {
  const item = await model.findById(id);
  if (!item || !item.isActive) {
    throw new CustomError("Item not found", 404);
  }
  return item;
}

export async function create(model: Model<any>, data: Record<string, unknown>) {
  return model.create(data);
}

export async function update(
  model: Model<any>,
  id: string,
  data: Record<string, unknown>
) {
  const item = await model.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!item) {
    throw new CustomError("Item not found", 404);
  }
  return item;
}

export async function softDelete(model: Model<any>, id: string) {
  const item = await model.findByIdAndUpdate(id, { isActive: false }, {
    new: true,
  });
  if (!item) {
    throw new CustomError("Item not found", 404);
  }
  return item;
}
