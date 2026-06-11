import Favorite from '../models/Favorite.js'
import Recipe from '../models/Recipe.js'

function sendRecipeNotFound(res) {
  res.status(404).json({ message: 'Receita nÃ£o encontrada.' })
}

export async function listFavorites(req, res) {
  const favorites = await Favorite.find({ usuario: req.user._id })
    .populate({
      path: 'receita',
      populate: {
        path: 'usuarioCriador',
        select: 'nome email',
      },
    })
    .sort({ createdAt: -1 })

  res.json({ favorites })
}

export async function addFavorite(req, res) {
  const recipe = await Recipe.findById(req.params.recipeId)

  if (!recipe) {
    sendRecipeNotFound(res)
    return
  }

  const existingFavorite = await Favorite.findOne({
    usuario: req.user._id,
    receita: req.params.recipeId,
  })

  if (existingFavorite) {
    res.status(200).json({ favorite: existingFavorite })
    return
  }

  const favorite = await Favorite.create({
    usuario: req.user._id,
    receita: req.params.recipeId,
  })

  res.status(201).json({ favorite })
}

export async function removeFavorite(req, res) {
  const favorite = await Favorite.findOne({
    usuario: req.user._id,
    receita: req.params.recipeId,
  })

  if (!favorite) {
    res.status(404).json({ message: 'Favorito nÃ£o encontrado.' })
    return
  }

  await favorite.deleteOne()

  res.status(204).send()
}
