import jwt from 'jsonwebtoken'
import request from 'supertest'
import { jest } from '@jest/globals'

const userFindById = jest.fn()
const recipeCreate = jest.fn()
const recipeFind = jest.fn()

jest.unstable_mockModule('../models/User.js', () => ({
  default: {
    findById: userFindById,
  },
}))

jest.unstable_mockModule('../models/Recipe.js', () => ({
  default: {
    create: recipeCreate,
    find: recipeFind,
  },
}))

const { default: app } = await import('../app.js')

const authUser = {
  _id: '507f1f77bcf86cd799439011',
  nome: 'Maria',
  email: 'maria@email.com',
}

function makeToken(user = authUser) {
  return jwt.sign({ sub: user._id, email: user.email }, process.env.JWT_SECRET)
}

function makeRecipe(overrides = {}) {
  return {
    _id: '507f1f77bcf86cd799439012',
    titulo: 'Bolo de cenoura',
    descricao: 'Receita simples.',
    ingredientes: ['2 cenouras', '2 ovos'],
    modoPreparo: ['Bata tudo', 'Leve ao forno'],
    tempoPreparo: 45,
    categoria: 'Sobremesa',
    imagemUrl: '',
    usuarioCriador: authUser._id,
    ...overrides,
  }
}

function mockRecipeFindResult(recipes = []) {
  const sort = jest.fn().mockResolvedValue(recipes)
  const populate = jest.fn().mockReturnValue({ sort })
  recipeFind.mockReturnValue({ populate })
  return { populate, sort }
}

describe('recipe routes', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.JWT_SECRET = 'segredo-de-teste'
    userFindById.mockResolvedValue(authUser)
  })

  it('requires authentication to list recipes', async () => {
    const response = await request(app).get('/api/recipes')

    expect(response.status).toBe(401)
    expect(response.body.message).toMatch(/token não informado/i)
    expect(recipeFind).not.toHaveBeenCalled()
  })

  it('creates a recipe for the authenticated user', async () => {
    const recipe = makeRecipe()
    recipeCreate.mockResolvedValue(recipe)

    const response = await request(app)
      .post('/api/recipes')
      .set('Authorization', `Bearer ${makeToken()}`)
      .send({
        titulo: recipe.titulo,
        descricao: recipe.descricao,
        ingredientes: recipe.ingredientes,
        modoPreparo: recipe.modoPreparo,
        tempoPreparo: recipe.tempoPreparo,
        categoria: recipe.categoria,
      })

    expect(response.status).toBe(201)
    expect(response.body.recipe).toEqual(recipe)
    expect(recipeCreate).toHaveBeenCalledWith({
      titulo: recipe.titulo,
      descricao: recipe.descricao,
      ingredientes: recipe.ingredientes,
      modoPreparo: recipe.modoPreparo,
      tempoPreparo: recipe.tempoPreparo,
      categoria: recipe.categoria,
      usuarioCriador: authUser._id,
    })
  })

  it('lists recipes with creator data', async () => {
    const recipes = [
      makeRecipe({
        usuarioCriador: {
          _id: authUser._id,
          nome: authUser.nome,
          email: authUser.email,
        },
      }),
    ]
    const { populate, sort } = mockRecipeFindResult(recipes)

    const response = await request(app)
      .get('/api/recipes')
      .set('Authorization', `Bearer ${makeToken()}`)

    expect(response.status).toBe(200)
    expect(response.body.recipes).toEqual(recipes)
    expect(recipeFind).toHaveBeenCalledWith({})
    expect(populate).toHaveBeenCalledWith('usuarioCriador', 'nome email')
    expect(sort).toHaveBeenCalledWith({ createdAt: -1 })
  })

  it('applies search and category filters when listing recipes', async () => {
    mockRecipeFindResult([])

    const response = await request(app)
      .get('/api/recipes?busca=bolo&categoria=Sobremesa')
      .set('Authorization', `Bearer ${makeToken()}`)

    expect(response.status).toBe(200)
    expect(recipeFind).toHaveBeenCalledWith({
      categoria: 'Sobremesa',
      $or: [
        { titulo: { $regex: 'bolo', $options: 'i' } },
        { descricao: { $regex: 'bolo', $options: 'i' } },
      ],
    })
  })
})
