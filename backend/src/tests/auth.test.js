import argon2 from 'argon2'
import jwt from 'jsonwebtoken'
import request from 'supertest'
import { jest } from '@jest/globals'

const findOne = jest.fn()
const create = jest.fn()
const findById = jest.fn()

jest.unstable_mockModule('../models/User.js', () => ({
  default: {
    findOne,
    create,
    findById,
  },
}))

const { default: app } = await import('../app.js')

function makeUser(overrides = {}) {
  return {
    _id: '507f1f77bcf86cd799439011',
    nome: 'Maria',
    email: 'maria@email.com',
    ...overrides,
  }
}

describe('auth routes', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.JWT_SECRET = 'segredo-de-teste'
  })

  it('registers a new user without returning passwordHash', async () => {
    const user = makeUser()
    findOne.mockResolvedValue(null)
    create.mockResolvedValue(user)

    const response = await request(app)
      .post('/api/auth/register')
      .send({
        nome: 'Maria',
        email: 'MARIA@EMAIL.COM',
        senha: '123456',
      })

    expect(response.status).toBe(201)
    expect(response.body.user).toEqual({
      _id: user._id,
      nome: user.nome,
      email: user.email,
    })
    expect(response.body.user.passwordHash).toBeUndefined()
    expect(response.body.token).toEqual(expect.any(String))
    expect(create).toHaveBeenCalledWith({
      nome: 'Maria',
      email: 'maria@email.com',
      passwordHash: expect.any(String),
    })
  })

  it('does not register duplicated email', async () => {
    findOne.mockResolvedValue(makeUser())

    const response = await request(app)
      .post('/api/auth/register')
      .send({
        nome: 'Maria',
        email: 'maria@email.com',
        senha: '123456',
      })

    expect(response.status).toBe(409)
    expect(response.body.message).toMatch(/email já cadastrado/i)
    expect(create).not.toHaveBeenCalled()
  })

  it('logs in with valid credentials', async () => {
    const passwordHash = await argon2.hash('123456')
    const user = makeUser({ passwordHash })
    const select = jest.fn().mockResolvedValue(user)
    findOne.mockReturnValue({ select })

    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'maria@email.com',
        senha: '123456',
      })

    expect(response.status).toBe(200)
    expect(response.body.user).toEqual({
      _id: user._id,
      nome: user.nome,
      email: user.email,
    })
    expect(response.body.user.passwordHash).toBeUndefined()
    expect(response.body.token).toEqual(expect.any(String))
    expect(select).toHaveBeenCalledWith('+passwordHash')
  })

  it('rejects login with invalid password', async () => {
    const passwordHash = await argon2.hash('senha-correta')
    const user = makeUser({ passwordHash })
    findOne.mockReturnValue({
      select: jest.fn().mockResolvedValue(user),
    })

    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'maria@email.com',
        senha: 'senha-errada',
      })

    expect(response.status).toBe(401)
    expect(response.body.message).toMatch(/credenciais inválidas/i)
  })

  it('returns current user with a valid token', async () => {
    const user = makeUser()
    const token = jwt.sign(
      { sub: user._id, email: user.email },
      process.env.JWT_SECRET,
    )
    findById.mockResolvedValue(user)

    const response = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.user).toEqual({
      _id: user._id,
      nome: user.nome,
      email: user.email,
    })
  })

  it('rejects protected route without token', async () => {
    const response = await request(app).get('/api/auth/me')

    expect(response.status).toBe(401)
    expect(response.body.message).toMatch(/token não informado/i)
  })
})
