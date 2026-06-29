import { createApp } from '../src/app'
import mongoose from 'mongoose'
import type { Request, Response } from 'express'

let cached = (global as any).__mongoose
if (!cached) {
  cached = (global as any).__mongoose = { conn: null, promise: null }
}

async function connectDB() {
  if (cached.conn) return cached.conn

  const uri = process.env.DB_URI
  if (!uri) throw new Error('DB_URI is not defined')

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri).then((m) => m)
  }

  cached.conn = await cached.promise
  return cached.conn
}

const { app } = createApp()

export default async function handler(req: Request, res: Response) {
  try {
    await connectDB()
  } catch (error) {
    res.status(500).json({ message: 'Database connection failed', error: (error as Error).message })
    return
  }
  app(req, res)
}
