import jwt from 'jsonwebtoken'
import request from 'supertest'
import { jest } from '@jest/globals'

const commentCreate = jest.fn()
const commentFind = jest.fn()
const commentFindById = jest.fn()
const recipeFindById = jest.fn()
const userFindById = jest.fn()

jest.unstable_mockModule('../models/Comment.js', () => ({
  default: {
    create: commentCreate,
    find: commentFind,
    findById: commentFindById,
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
const commentId = '507f1f77bcf86cd799439031'

function makeToken(id = userId) {
  return jwt.sign({ sub: id, email: 'rafa@email.com' }, process.env.JWT_SECRET)
}

function makeUser(overrides = {}) {
  return {
    _id: userId,
    nome: 'Rafa',
    email: 'rafa@email.com',
    ...overrides,
  }
}

function makeComment(overrides = {}) {
  return {
    _id: commentId,
    usuario: userId,
    receita: recipeId,
    texto: 'Ficou muito bom.',
    nota: 5,
    createdAt: '2026-06-08T10:00:00.000Z',
    updatedAt: '2026-06-08T10:00:00.000Z',
    save: jest.fn().mockResolvedValue(undefined),
    deleteOne: jest.fn().mockResolvedValue(undefined),
    ...overrides,
  }
}

function mockCommentList(comments) {
  const sort = jest.fn().mockResolvedValue(comments)
  commentFind.mockReturnValue({ sort })
  return { sort }
}

describe('comment routes', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.JWT_SECRET = 'segredo-de-teste'
    userFindById.mockResolvedValue(makeUser())
  })

  it('lists comments filtered by recipe', async () => {
    const comments = [makeComment()]
    const { sort } = mockCommentList(comments)

    const response = await request(app).get(`/api/comments?receita=${recipeId}`)

    expect(response.status).toBe(200)
    expect(response.body.comments).toHaveLength(1)
    expect(response.body.comments[0]).toMatchObject({
      _id: commentId,
      usuario: userId,
      receita: recipeId,
      texto: 'Ficou muito bom.',
      nota: 5,
    })
    expect(commentFind).toHaveBeenCalledWith({ receita: recipeId })
    expect(sort).toHaveBeenCalledWith({ createdAt: -1 })
  })

  it('gets a comment by id', async () => {
    commentFindById.mockResolvedValue(makeComment())

    const response = await request(app).get(`/api/comments/${commentId}`)

    expect(response.status).toBe(200)
    expect(response.body.comment).toMatchObject({
      _id: commentId,
      texto: 'Ficou muito bom.',
      nota: 5,
    })
    expect(commentFindById).toHaveBeenCalledWith(commentId)
  })

  it('creates an authenticated comment as the current user', async () => {
    recipeFindById.mockResolvedValue({ _id: recipeId })
    commentCreate.mockResolvedValue(makeComment({ texto: 'Otima receita.', nota: 4 }))

    const response = await request(app)
      .post('/api/comments')
      .set('Authorization', `Bearer ${makeToken()}`)
      .send({
        receita: recipeId,
        texto: '  Otima receita.  ',
        nota: 4,
      })

    expect(response.status).toBe(201)
    expect(response.body.comment).toMatchObject({
      usuario: userId,
      receita: recipeId,
      texto: 'Otima receita.',
      nota: 4,
    })
    expect(commentCreate).toHaveBeenCalledWith({
      usuario: userId,
      receita: recipeId,
      texto: 'Otima receita.',
      nota: 4,
    })
  })

  it('rejects comment creation without authentication', async () => {
    const response = await request(app)
      .post('/api/comments')
      .send({
        receita: recipeId,
        texto: 'Gostei.',
        nota: 5,
      })

    expect(response.status).toBe(401)
    expect(commentCreate).not.toHaveBeenCalled()
  })

  it('validates rating when creating a comment', async () => {
    const response = await request(app)
      .post('/api/comments')
      .set('Authorization', `Bearer ${makeToken()}`)
      .send({
        receita: recipeId,
        texto: 'Gostei.',
        nota: 6,
      })

    expect(response.status).toBe(400)
    expect(response.body.message).toMatch(/nota/i)
    expect(recipeFindById).not.toHaveBeenCalled()
    expect(commentCreate).not.toHaveBeenCalled()
  })

  it('updates only comments owned by the current user', async () => {
    const comment = makeComment()
    commentFindById.mockResolvedValue(comment)

    const response = await request(app)
      .put(`/api/comments/${commentId}`)
      .set('Authorization', `Bearer ${makeToken()}`)
      .send({
        texto: 'Agora ficou excelente.',
        nota: 5,
      })

    expect(response.status).toBe(200)
    expect(response.body.comment).toMatchObject({
      texto: 'Agora ficou excelente.',
      nota: 5,
    })
    expect(comment.save).toHaveBeenCalled()
  })

  it('forbids updating comments from another user', async () => {
    const comment = makeComment({ usuario: otherUserId })
    commentFindById.mockResolvedValue(comment)

    const response = await request(app)
      .put(`/api/comments/${commentId}`)
      .set('Authorization', `Bearer ${makeToken()}`)
      .send({
        texto: 'Tentativa de edicao.',
      })

    expect(response.status).toBe(403)
    expect(comment.save).not.toHaveBeenCalled()
  })

  it('deletes only comments owned by the current user', async () => {
    const comment = makeComment()
    commentFindById.mockResolvedValue(comment)

    const response = await request(app)
      .delete(`/api/comments/${commentId}`)
      .set('Authorization', `Bearer ${makeToken()}`)

    expect(response.status).toBe(204)
    expect(comment.deleteOne).toHaveBeenCalled()
  })

  it('returns 404 when the comment does not exist', async () => {
    commentFindById.mockResolvedValue(null)

    const response = await request(app).get(`/api/comments/${commentId}`)

    expect(response.status).toBe(404)
    expect(response.body.message).toMatch(/nao encontrado/i)
  })
})
