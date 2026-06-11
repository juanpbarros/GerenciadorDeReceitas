import jwt from 'jsonwebtoken'
import request from 'supertest'
import { jest } from '@jest/globals'

const shoppingListCreate = jest.fn()
const shoppingListFind = jest.fn()
const shoppingListFindById = jest.fn()
const userFindById = jest.fn()

jest.unstable_mockModule('../models/ShoppingList.js', () => ({
  default: {
    create: shoppingListCreate,
    find: shoppingListFind,
    findById: shoppingListFindById,
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
const shoppingListId = '507f1f77bcf86cd799439041'

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

function makeShoppingList(overrides = {}) {
  return {
    _id: shoppingListId,
    usuario: userId,
    nome: 'Compras do bolo',
    itens: [
      { _id: 'item-1', nome: 'farinha', comprado: false },
      { _id: 'item-2', nome: 'fermento', comprado: true },
    ],
    save: jest.fn().mockImplementation(function save() {
      return Promise.resolve(this)
    }),
    deleteOne: jest.fn().mockResolvedValue(undefined),
    ...overrides,
  }
}

function mockShoppingListFindResult(shoppingLists = []) {
  const sort = jest.fn().mockResolvedValue(shoppingLists)
  shoppingListFind.mockReturnValue({ sort })
  return { sort }
}

describe('shopping list routes', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.JWT_SECRET = 'segredo-de-teste'
    userFindById.mockResolvedValue(makeUser())
  })

  it('requires authentication to list shopping lists', async () => {
    const response = await request(app).get('/api/shopping-lists')

    expect(response.status).toBe(401)
    expect(shoppingListFind).not.toHaveBeenCalled()
  })

  it('creates a shopping list for the authenticated user', async () => {
    const shoppingList = makeShoppingList()
    shoppingListCreate.mockResolvedValue(shoppingList)

    const response = await request(app)
      .post('/api/shopping-lists')
      .set('Authorization', `Bearer ${makeToken()}`)
      .send({
        nome: '  Compras do bolo  ',
        itens: [
          { nome: ' farinha ', comprado: false },
          { nome: 'fermento', comprado: true },
        ],
      })

    expect(response.status).toBe(201)
    expect(response.body.shoppingList).toMatchObject({
      _id: shoppingList._id,
      usuario: shoppingList.usuario,
      nome: shoppingList.nome,
      itens: shoppingList.itens,
    })
    expect(shoppingListCreate).toHaveBeenCalledWith({
      usuario: userId,
      nome: 'Compras do bolo',
      itens: [
        { nome: 'farinha', comprado: false },
        { nome: 'fermento', comprado: true },
      ],
    })
  })

  it('validates name and items when creating a shopping list', async () => {
    const response = await request(app)
      .post('/api/shopping-lists')
      .set('Authorization', `Bearer ${makeToken()}`)
      .send({ nome: '', itens: [{ nome: '' }] })

    expect(response.status).toBe(400)
    expect(response.body.message).toMatch(/nome da lista/i)
    expect(shoppingListCreate).not.toHaveBeenCalled()
  })

  it('lists only shopping lists from the authenticated user', async () => {
    const shoppingLists = [makeShoppingList()]
    const { sort } = mockShoppingListFindResult(shoppingLists)

    const response = await request(app)
      .get('/api/shopping-lists')
      .set('Authorization', `Bearer ${makeToken()}`)

    expect(response.status).toBe(200)
    expect(response.body.shoppingLists).toEqual([
      {
        _id: shoppingLists[0]._id,
        usuario: shoppingLists[0].usuario,
        nome: shoppingLists[0].nome,
        itens: shoppingLists[0].itens,
      },
    ])
    expect(shoppingListFind).toHaveBeenCalledWith({ usuario: userId })
    expect(sort).toHaveBeenCalledWith({ createdAt: -1 })
  })

  it('gets a shopping list owned by the authenticated user', async () => {
    const shoppingList = makeShoppingList()
    shoppingListFindById.mockResolvedValue(shoppingList)

    const response = await request(app)
      .get(`/api/shopping-lists/${shoppingListId}`)
      .set('Authorization', `Bearer ${makeToken()}`)

    expect(response.status).toBe(200)
    expect(response.body.shoppingList).toMatchObject({
      _id: shoppingList._id,
      usuario: shoppingList.usuario,
      nome: shoppingList.nome,
      itens: shoppingList.itens,
    })
  })

  it('does not get a shopping list from another user', async () => {
    shoppingListFindById.mockResolvedValue(makeShoppingList({ usuario: otherUserId }))

    const response = await request(app)
      .get(`/api/shopping-lists/${shoppingListId}`)
      .set('Authorization', `Bearer ${makeToken()}`)

    expect(response.status).toBe(403)
  })

  it('updates a shopping list owned by the authenticated user', async () => {
    const shoppingList = makeShoppingList()
    shoppingListFindById.mockResolvedValue(shoppingList)

    const response = await request(app)
      .patch(`/api/shopping-lists/${shoppingListId}`)
      .set('Authorization', `Bearer ${makeToken()}`)
      .send({
        nome: 'Compras da semana',
        itens: [{ nome: 'leite', comprado: true }],
      })

    expect(response.status).toBe(200)
    expect(shoppingList.nome).toBe('Compras da semana')
    expect(shoppingList.itens).toEqual([{ nome: 'leite', comprado: true }])
    expect(shoppingList.save).toHaveBeenCalledTimes(1)
  })

  it('does not update a shopping list from another user', async () => {
    const shoppingList = makeShoppingList({ usuario: otherUserId })
    shoppingListFindById.mockResolvedValue(shoppingList)

    const response = await request(app)
      .patch(`/api/shopping-lists/${shoppingListId}`)
      .set('Authorization', `Bearer ${makeToken()}`)
      .send({
        nome: 'Tentativa indevida',
        itens: [{ nome: 'leite', comprado: false }],
      })

    expect(response.status).toBe(403)
    expect(shoppingList.save).not.toHaveBeenCalled()
  })

  it('deletes a shopping list owned by the authenticated user', async () => {
    const shoppingList = makeShoppingList()
    shoppingListFindById.mockResolvedValue(shoppingList)

    const response = await request(app)
      .delete(`/api/shopping-lists/${shoppingListId}`)
      .set('Authorization', `Bearer ${makeToken()}`)

    expect(response.status).toBe(204)
    expect(shoppingList.deleteOne).toHaveBeenCalledTimes(1)
  })

  it('returns 404 when the shopping list does not exist', async () => {
    shoppingListFindById.mockResolvedValue(null)

    const response = await request(app)
      .get(`/api/shopping-lists/${shoppingListId}`)
      .set('Authorization', `Bearer ${makeToken()}`)

    expect(response.status).toBe(404)
  })
})
