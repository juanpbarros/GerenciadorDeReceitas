import mongoose from 'mongoose'
import Comment from '../models/Comment.js'
import Recipe from '../models/Recipe.js'

const userId = new mongoose.Types.ObjectId()
const recipeId = new mongoose.Types.ObjectId()

function makeRecipe(overrides = {}) {
  return new Recipe({
    titulo: 'Bolo de cenoura',
    descricao: 'Receita simples para o café da tarde.',
    ingredientes: ['2 cenouras', '2 ovos'],
    modoPreparo: ['Bata os ingredientes', 'Leve ao forno'],
    tempoPreparo: 45,
    categoria: 'Sobremesa',
    usuarioCriador: userId,
    ...overrides,
  })
}

function makeComment(overrides = {}) {
  return new Comment({
    usuario: userId,
    receita: recipeId,
    texto: 'Ficou muito bom.',
    nota: 5,
    ...overrides,
  })
}

describe('recipe model', () => {
  it('validates a complete recipe', async () => {
    await expect(makeRecipe().validate()).resolves.toBeUndefined()
  })

  it('requires at least one ingredient and one preparation step', async () => {
    const recipe = makeRecipe({ ingredientes: [], modoPreparo: [] })

    await expect(recipe.validate()).rejects.toMatchObject({
      errors: {
        ingredientes: expect.any(Object),
        modoPreparo: expect.any(Object),
      },
    })
  })

  it('accepts only predefined categories', async () => {
    const recipe = makeRecipe({ categoria: 'Categoria livre' })

    await expect(recipe.validate()).rejects.toMatchObject({
      errors: {
        categoria: expect.any(Object),
      },
    })
  })
})

describe('comment model', () => {
  it('validates a complete comment', async () => {
    await expect(makeComment().validate()).resolves.toBeUndefined()
  })

  it('requires user, recipe and text', async () => {
    const comment = makeComment({ usuario: undefined, receita: undefined, texto: '' })

    await expect(comment.validate()).rejects.toMatchObject({
      errors: {
        usuario: expect.any(Object),
        receita: expect.any(Object),
        texto: expect.any(Object),
      },
    })
  })

  it('limits rating from 1 to 5', async () => {
    await expect(makeComment({ nota: 0 }).validate()).rejects.toMatchObject({
      errors: {
        nota: expect.any(Object),
      },
    })

    await expect(makeComment({ nota: 6 }).validate()).rejects.toMatchObject({
      errors: {
        nota: expect.any(Object),
      },
    })
  })
})
