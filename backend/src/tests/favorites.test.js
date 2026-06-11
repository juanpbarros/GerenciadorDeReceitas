import jwt from 'jsonwebtoken'
import request from 'supertest'
import { jest } from '@jest/globals'

const favoriteCreate = jest.fn()
const favoriteFind = jest.fn()
const favoriteFindOne = jest.fn()
const recipeFindById = jest.fn()
const userFindById = jest.fn()

jest.unstable_mockModule('../models/Favorite.js', () => ({
  default: {
    create: favoriteCreate,
    find: favoriteFind,
    findOne: favoriteFindOne,
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
const recipeId = '507f1f77bcf86cd799439012'

function makeToken(id = userId) {
  return jwt.sign({ sub: id, email: 'juan@email.com' }, process.env.JWT_SECRET)
}

function makeUser(overrides = {}) {
  return {
    _id: userId,
    nome: 'Juan',
    email: 'juan@email.com',
    ...overrides,
  }
}

function makeFavorite(overrides = {}) {
  return {
    _id: '507f1f77bcf86cd799439051',
    usuario: userId,
    receita: recipeId,
    deleteOne: jest.fn().mockResolvedValue(undefined),
    ...overrides,
  }
}

function makeRecipe(overrides = {}) {
  return {
    _id: recipeId,
    titulo: 'Bolo de cenoura',
    descricao: 'Receita simples.',
    ...overrides,
  }
}

function mockFavoriteFindResult(favorites = []) {
  const sort = jest.fn().mockResolvedValue(favorites)
  const populateRecipe = jest.fn().mockReturnValue({ sort })
  favoriteFind.mockReturnValue({ populate: populateRecipe })

  return { populateRecipe, sort }
}

describe('favorite routes', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.JWT_SECRET = 'segredo-de-teste'
    userFindById.mockResolvedValue(makeUser())
  })

  it('requires authentication to list favorites', async () => {
    const response = await request(app).get('/api/favorites')

    expect(response.status).toBe(401)
    expect(favoriteFind).not.toHaveBeenCalled()
  })

  it('lists favorites from the authenticated user', async () => {
    const favorites = [
      makeFavorite({
        receita: makeRecipe({
          usuarioCriador: {
            _id: userId,
            nome: 'Juan',
            email: 'juan@email.com',
          },
        }),
      }),
    ]
    const { populateRecipe, sort } = mockFavoriteFindResult(favorites)

    const response = await request(app)
      .get('/api/favorites')
      .set('Authorization', `Bearer ${makeToken()}`)

    expect(response.status).toBe(200)
    expect(response.body.favorites).toEqual([
      {
        _id: favorites[0]._id,
        usuario: favorites[0].usuario,
        receita: favorites[0].receita,
      },
    ])
    expect(favoriteFind).toHaveBeenCalledWith({ usuario: userId })
    expect(populateRecipe).toHaveBeenCalledWith({
      path: 'receita',
      populate: {
        path: 'usuarioCriador',
        select: 'nome email',
      },
    })
    expect(sort).toHaveBeenCalledWith({ createdAt: -1 })
  })

  it('creates a favorite for an existing recipe', async () => {
    const favorite = makeFavorite()
    recipeFindById.mockResolvedValue(makeRecipe())
    favoriteFindOne.mockResolvedValue(null)
    favoriteCreate.mockResolvedValue(favorite)

    const response = await request(app)
      .post(`/api/favorites/${recipeId}`)
      .set('Authorization', `Bearer ${makeToken()}`)

    expect(response.status).toBe(201)
    expect(response.body.favorite).toEqual({
      _id: favorite._id,
      usuario: favorite.usuario,
      receita: favorite.receita,
    })
    expect(recipeFindById).toHaveBeenCalledWith(recipeId)
    expect(favoriteFindOne).toHaveBeenCalledWith({ usuario: userId, receita: recipeId })
    expect(favoriteCreate).toHaveBeenCalledWith({ usuario: userId, receita: recipeId })
  })

  it('returns the existing favorite when recipe is already favorited', async () => {
    const favorite = makeFavorite()
    recipeFindById.mockResolvedValue(makeRecipe())
    favoriteFindOne.mockResolvedValue(favorite)

    const response = await request(app)
      .post(`/api/favorites/${recipeId}`)
      .set('Authorization', `Bearer ${makeToken()}`)

    expect(response.status).toBe(200)
    expect(response.body.favorite).toEqual({
      _id: favorite._id,
      usuario: favorite.usuario,
      receita: favorite.receita,
    })
    expect(favoriteCreate).not.toHaveBeenCalled()
  })

  it('does not favorite a missing recipe', async () => {
    recipeFindById.mockResolvedValue(null)

    const response = await request(app)
      .post(`/api/favorites/${recipeId}`)
      .set('Authorization', `Bearer ${makeToken()}`)

    expect(response.status).toBe(404)
    expect(response.body.message).toMatch(/receita/i)
    expect(favoriteCreate).not.toHaveBeenCalled()
  })

  it('removes a favorite from the authenticated user', async () => {
    const favorite = makeFavorite()
    favoriteFindOne.mockResolvedValue(favorite)

    const response = await request(app)
      .delete(`/api/favorites/${recipeId}`)
      .set('Authorization', `Bearer ${makeToken()}`)

    expect(response.status).toBe(204)
    expect(favoriteFindOne).toHaveBeenCalledWith({ usuario: userId, receita: recipeId })
    expect(favorite.deleteOne).toHaveBeenCalledTimes(1)
  })

  it('returns 404 when removing a missing favorite', async () => {
    favoriteFindOne.mockResolvedValue(null)

    const response = await request(app)
      .delete(`/api/favorites/${recipeId}`)
      .set('Authorization', `Bearer ${makeToken()}`)

    expect(response.status).toBe(404)
    expect(response.body.message).toMatch(/favorito/i)
  })
})
