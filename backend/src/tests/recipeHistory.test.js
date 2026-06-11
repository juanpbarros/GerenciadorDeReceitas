import jwt from 'jsonwebtoken'
import request from 'supertest'
import { jest } from '@jest/globals'

const historyCreate = jest.fn()
const historyFind = jest.fn()
const historyFindById = jest.fn()
const recipeFindById = jest.fn()
const userFindById = jest.fn()

jest.unstable_mockModule('../models/RecipeHistory.js', () => ({
  default: {
    create: historyCreate,
    find: historyFind,
    findById: historyFindById,
  },
}))

jest.unstable_mockModule('../models/Recipe.js', () => ({
  default: {
    findById: recipeFindById,
  },
}))

jest.unstable_mockModule('../models/User.js', () => ({
  default: {
    findById: userFindById,
  },
}))

const { default: app } = await import('../app.js')

const userId = '507f1f77bcf86cd799439011'
const otherUserId = '507f1f77bcf86cd799439012'
const recipeId = '507f1f77bcf86cd799439021'
const historyId = '507f1f77bcf86cd799439051'

function makeToken(id = userId) {
  return jwt.sign({ sub: id, email: 'rafa@email.com' }, process.env.JWT_SECRET)
}

function makeUser(overrides = {}) {
  return {
    _id: userId,
    nome: 'Rafaela',
    email: 'rafa@email.com',
    ...overrides,
  }
}

function makeHistory(overrides = {}) {
  return {
    _id: historyId,
    usuario: userId,
    receita: recipeId,
    data: '2026-06-10T00:00:00.000Z',
    observacao: 'Ficou ótimo.',
    notaPessoal: 5,
    createdAt: '2026-06-10T10:00:00.000Z',
    updatedAt: '2026-06-10T10:00:00.000Z',
    save: jest.fn().mockImplementation(function save() {
      return Promise.resolve(this)
    }),
    deleteOne: jest.fn().mockResolvedValue(undefined),
    ...overrides,
  }
}

function mockHistoryFindResult(history = []) {
  const sort = jest.fn().mockResolvedValue(history)
  const populate = jest.fn().mockReturnValue({ sort })
  historyFind.mockReturnValue({ populate })
  return { populate, sort }
}

function mockHistoryFindByIdResult(historyRecord) {
  const populate = jest.fn().mockResolvedValue(historyRecord)
  historyFindById.mockReturnValue({ populate })
  return { populate }
}

describe('recipe history routes', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.JWT_SECRET = 'segredo-de-teste'
    userFindById.mockResolvedValue(makeUser())
    recipeFindById.mockResolvedValue({ _id: recipeId })
  })

  it('requires authentication to list recipe history', async () => {
    const response = await request(app).get('/api/recipe-history')

    expect(response.status).toBe(401)
    expect(historyFind).not.toHaveBeenCalled()
  })

  it('lists only history records from the authenticated user', async () => {
    const history = [makeHistory()]
    const { populate, sort } = mockHistoryFindResult(history)

    const response = await request(app)
      .get('/api/recipe-history')
      .set('Authorization', `Bearer ${makeToken()}`)

    expect(response.status).toBe(200)
    expect(response.body.history).toHaveLength(1)
    expect(response.body.history[0]).toMatchObject({
      _id: historyId,
      usuario: userId,
      receita: recipeId,
      observacao: 'Ficou ótimo.',
      notaPessoal: 5,
    })
    expect(historyFind).toHaveBeenCalledWith({ usuario: userId })
    expect(populate).toHaveBeenCalledWith('receita', 'titulo categoria tempoPreparo imagemUrl')
    expect(sort).toHaveBeenCalledWith({ data: -1, createdAt: -1 })
  })

  it('creates a history record for the authenticated user', async () => {
    const historyRecord = makeHistory()
    historyCreate.mockResolvedValue(historyRecord)

    const response = await request(app)
      .post('/api/recipe-history')
      .set('Authorization', `Bearer ${makeToken()}`)
      .send({
        receita: recipeId,
        data: '2026-06-10',
        observacao: ' Ficou ótimo. ',
        notaPessoal: 5,
      })

    expect(response.status).toBe(201)
    expect(response.body.historyRecord).toMatchObject({
      _id: historyId,
      usuario: userId,
      receita: recipeId,
      observacao: 'Ficou ótimo.',
      notaPessoal: 5,
    })
    expect(historyCreate).toHaveBeenCalledWith({
      usuario: userId,
      receita: recipeId,
      data: expect.any(Date),
      observacao: 'Ficou ótimo.',
      notaPessoal: 5,
    })
  })

  it('validates required fields when creating a history record', async () => {
    const response = await request(app)
      .post('/api/recipe-history')
      .set('Authorization', `Bearer ${makeToken()}`)
      .send({ receita: recipeId, data: '' })

    expect(response.status).toBe(400)
    expect(response.body.message).toMatch(/data/i)
    expect(historyCreate).not.toHaveBeenCalled()
  })

  it('validates personal rating when creating a history record', async () => {
    const response = await request(app)
      .post('/api/recipe-history')
      .set('Authorization', `Bearer ${makeToken()}`)
      .send({ receita: recipeId, data: '2026-06-10', notaPessoal: 6 })

    expect(response.status).toBe(400)
    expect(response.body.message).toMatch(/nota pessoal/i)
    expect(historyCreate).not.toHaveBeenCalled()
  })

  it('returns 404 when recipe does not exist', async () => {
    recipeFindById.mockResolvedValue(null)

    const response = await request(app)
      .post('/api/recipe-history')
      .set('Authorization', `Bearer ${makeToken()}`)
      .send({ receita: recipeId, data: '2026-06-10' })

    expect(response.status).toBe(404)
    expect(historyCreate).not.toHaveBeenCalled()
  })

  it('gets a history record owned by the authenticated user', async () => {
    const historyRecord = makeHistory()
    const { populate } = mockHistoryFindByIdResult(historyRecord)

    const response = await request(app)
      .get(`/api/recipe-history/${historyId}`)
      .set('Authorization', `Bearer ${makeToken()}`)

    expect(response.status).toBe(200)
    expect(response.body.historyRecord).toMatchObject({
      _id: historyId,
      usuario: userId,
      receita: recipeId,
    })
    expect(populate).toHaveBeenCalledWith('receita', 'titulo categoria tempoPreparo imagemUrl')
  })

  it('does not get a history record from another user', async () => {
    mockHistoryFindByIdResult(makeHistory({ usuario: otherUserId }))

    const response = await request(app)
      .get(`/api/recipe-history/${historyId}`)
      .set('Authorization', `Bearer ${makeToken()}`)

    expect(response.status).toBe(403)
  })

  it('updates a history record owned by the authenticated user', async () => {
    const historyRecord = makeHistory()
    historyFindById.mockResolvedValue(historyRecord)

    const response = await request(app)
      .patch(`/api/recipe-history/${historyId}`)
      .set('Authorization', `Bearer ${makeToken()}`)
      .send({
        receita: recipeId,
        data: '2026-06-11',
        observacao: 'Melhorou bastante.',
        notaPessoal: 4,
      })

    expect(response.status).toBe(200)
    expect(historyRecord.observacao).toBe('Melhorou bastante.')
    expect(historyRecord.notaPessoal).toBe(4)
    expect(historyRecord.save).toHaveBeenCalledTimes(1)
  })

  it('does not update a history record from another user', async () => {
    const historyRecord = makeHistory({ usuario: otherUserId })
    historyFindById.mockResolvedValue(historyRecord)

    const response = await request(app)
      .patch(`/api/recipe-history/${historyId}`)
      .set('Authorization', `Bearer ${makeToken()}`)
      .send({
        receita: recipeId,
        data: '2026-06-11',
      })

    expect(response.status).toBe(403)
    expect(historyRecord.save).not.toHaveBeenCalled()
  })

  it('deletes a history record owned by the authenticated user', async () => {
    const historyRecord = makeHistory()
    historyFindById.mockResolvedValue(historyRecord)

    const response = await request(app)
      .delete(`/api/recipe-history/${historyId}`)
      .set('Authorization', `Bearer ${makeToken()}`)

    expect(response.status).toBe(204)
    expect(historyRecord.deleteOne).toHaveBeenCalledTimes(1)
  })

  it('returns 404 when the history record does not exist', async () => {
    historyFindById.mockResolvedValue(null)

    const response = await request(app)
      .delete(`/api/recipe-history/${historyId}`)
      .set('Authorization', `Bearer ${makeToken()}`)

    expect(response.status).toBe(404)
  })
})
