import mongoose from 'mongoose'

const connectionOptions = {
  serverSelectionTimeoutMS: 5000,
}

const connectionStates = {
  0: 'disconnected',
  1: 'connected',
  2: 'connecting',
  3: 'disconnecting',
}

export async function connectDatabase(uri = process.env.MONGODB_URI) {
  if (!uri) {
    throw new Error('MONGODB_URI não configurada.')
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection
  }

  await mongoose.connect(uri, connectionOptions)
  return mongoose.connection
}

export async function disconnectDatabase() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect()
  }
}

export function getDatabaseStatus() {
  return connectionStates[mongoose.connection.readyState] || 'unknown'
}
