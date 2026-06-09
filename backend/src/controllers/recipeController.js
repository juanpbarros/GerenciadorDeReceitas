import Recipe from '../models/Recipe.js'

function isRecipeOwner(recipe, userId) {
  return recipe.usuarioCriador?.toString() === userId?.toString()
}

function sendNotFound(res) {
  res.status(404).json({ message: 'Receita não encontrada.' })
}

function sendForbidden(res) {
  res.status(403).json({ message: 'Apenas o dono pode alterar esta receita.' })
}

export async function createRecipe(req, res) {
  const recipe = await Recipe.create({
    ...req.body,
    usuarioCriador: req.user._id,
  })

  res.status(201).json({ recipe })
}

export async function listRecipes(req, res) {
  const { busca, categoria } = req.query
  const filters = {}

  if (categoria) filters.categoria = categoria

  if (busca) {
    filters.$or = [
      { titulo: { $regex: busca, $options: 'i' } },
      { descricao: { $regex: busca, $options: 'i' } },
    ]
  }

  const recipes = await Recipe.find(filters)
    .populate('usuarioCriador', 'nome email')
    .sort({ createdAt: -1 })

  res.json({ recipes })
}

export async function getRecipeById(req, res) {
  const recipe = await Recipe.findById(req.params.id)
    .populate('usuarioCriador', 'nome email')

  if (!recipe) {
    sendNotFound(res)
    return
  }

  res.json({ recipe })
}

export async function updateRecipe(req, res) {
  const recipe = await Recipe.findById(req.params.id)

  if (!recipe) {
    sendNotFound(res)
    return
  }

  if (!isRecipeOwner(recipe, req.user._id)) {
    sendForbidden(res)
    return
  }

  Object.assign(recipe, req.body)
  const updatedRecipe = await recipe.save()

  res.json({ recipe: updatedRecipe })
}

export async function deleteRecipe(req, res) {
  const recipe = await Recipe.findById(req.params.id)

  if (!recipe) {
    sendNotFound(res)
    return
  }

  if (!isRecipeOwner(recipe, req.user._id)) {
    sendForbidden(res)
    return
  }

  await recipe.deleteOne()

  res.status(204).send()
}
