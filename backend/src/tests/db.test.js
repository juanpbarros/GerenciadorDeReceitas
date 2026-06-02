import { jest } from '@jest/globals'

const connect = jest.fn()
const disconnect = jest.fn()
const connection = { readyState: 0 }

jest.unstable_mockModule('mongoose', () => ({
  default: {
    connect,
    disconnect,
    connection,
  },
}))

const {
  connectDatabase,
  disconnectDatabase,
  getDatabaseStatus,
} = await import('../config/db.js')

describe('database config', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    connection.readyState = 0
    delete process.env.MONGODB_URI
  })

  it('throws when MONGODB_URI is missing', async () => {
    await expect(connectDatabase()).rejects.toThrow('MONGODB_URI não configurada.')
  })

  it('connects using the provided MongoDB URI', async () => {
    const uri = 'mongodb+srv://usuario:senha@cluster.mongodb.net/receitas'

    await connectDatabase(uri)

    expect(connect).toHaveBeenCalledWith(uri, {
      serverSelectionTimeoutMS: 5000,
    })
  })

  it('reuses an active connection', async () => {
    connection.readyState = 1

    const result = await connectDatabase('mongodb+srv://cluster.mongodb.net/receitas')

    expect(result).toBe(connection)
    expect(connect).not.toHaveBeenCalled()
  })

  it('disconnects only when there is an active connection state', async () => {
    connection.readyState = 1

    await disconnectDatabase()

    expect(disconnect).toHaveBeenCalledTimes(1)
  })

  it('returns the readable database status', () => {
    connection.readyState = 2

    expect(getDatabaseStatus()).toBe('connecting')
  })
})
