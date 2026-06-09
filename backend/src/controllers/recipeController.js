import Recipe from '../models/Recipe.js'

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
