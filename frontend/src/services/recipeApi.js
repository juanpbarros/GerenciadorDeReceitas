import { apiClient } from './apiClient'

export function normalizeRecipe(recipe) {
  return {
    id: recipe._id,
    title: recipe.titulo,
    description: recipe.descricao,
    ingredients: recipe.ingredientes || [],
    preparationSteps: recipe.modoPreparo || [],
    prepTimeMinutes: recipe.tempoPreparo,
    category: recipe.categoria,
    imageUrl: recipe.imagemUrl || '',
    creator: recipe.usuarioCriador || null,
    origin: 'own',
    sourceName: null,
    rating: recipe.rating || 0,
  }
}

export async function listRecipesRequest({ busca = '', categoria = '' } = {}) {
  const response = await apiClient.get('/recipes', {
    params: {
      ...(busca ? { busca } : {}),
      ...(categoria ? { categoria } : {}),
    },
  })

  return {
    recipes: response.data.recipes.map(normalizeRecipe),
  }
}

export async function createRecipeRequest(recipe) {
  const response = await apiClient.post('/recipes', recipe)

  return {
    recipe: normalizeRecipe(response.data.recipe),
  }
}

export async function getRecipeRequest(id) {
  const response = await apiClient.get(`/recipes/${id}`)

  return {
    recipe: normalizeRecipe(response.data.recipe),
  }
}

export async function updateRecipeRequest(id, recipe) {
  const response = await apiClient.patch(`/recipes/${id}`, recipe)

  return {
    recipe: normalizeRecipe(response.data.recipe),
  }
}

export async function deleteRecipeRequest(id) {
  await apiClient.delete(`/recipes/${id}`)
}
