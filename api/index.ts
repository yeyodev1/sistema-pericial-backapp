import { createApp } from '../src/app'
import mongoose from 'mongoose'

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

connectDB().catch((err) => console.error('MongoDB connection error:', err))

export default app
