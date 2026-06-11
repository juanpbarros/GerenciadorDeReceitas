import { apiClient } from './apiClient'
import { normalizeRecipe } from './recipeApi'

export function normalizeFavorite(favorite) {
  return {
    id: favorite._id,
    recipeId: favorite.receita?._id || favorite.receita,
    recipe: favorite.receita && typeof favorite.receita === 'object'
      ? normalizeRecipe(favorite.receita)
      : null,
  }
}

export async function listFavoritesRequest() {
  const response = await apiClient.get('/favorites')

  return {
    favorites: response.data.favorites.map(normalizeFavorite),
  }
}

export async function addFavoriteRequest(recipeId) {
  const response = await apiClient.post(`/favorites/${recipeId}`)

  return {
    favorite: normalizeFavorite(response.data.favorite),
  }
}

export async function removeFavoriteRequest(recipeId) {
  await apiClient.delete(`/favorites/${recipeId}`)
}
