import { apiClient } from './apiClient'

export function normalizeHistoryRecord(historyRecord) {
  const recipe = historyRecord.receita

  return {
    id: historyRecord._id || historyRecord.id,
    recipeId: typeof recipe === 'object' && recipe !== null ? recipe._id : recipe,
    recipeTitle: typeof recipe === 'object' && recipe !== null ? recipe.titulo : 'Receita',
    recipeCategory: typeof recipe === 'object' && recipe !== null ? recipe.categoria : '',
    date: historyRecord.data,
    observation: historyRecord.observacao || '',
    personalRating: historyRecord.notaPessoal ?? '',
    createdAt: historyRecord.createdAt,
    updatedAt: historyRecord.updatedAt,
  }
}

function toApiPayload(historyRecord) {
  return {
    receita: historyRecord.recipeId,
    data: historyRecord.date,
    observacao: historyRecord.observation,
    notaPessoal: historyRecord.personalRating || null,
  }
}

export async function listRecipeHistoryRequest() {
  const response = await apiClient.get('/recipe-history')

  return {
    history: response.data.history.map(normalizeHistoryRecord),
  }
}

export async function createRecipeHistoryRequest(historyRecord) {
  const response = await apiClient.post('/recipe-history', toApiPayload(historyRecord))

  return {
    historyRecord: normalizeHistoryRecord(response.data.historyRecord),
  }
}

export async function updateRecipeHistoryRequest(id, historyRecord) {
  const response = await apiClient.patch(`/recipe-history/${id}`, toApiPayload(historyRecord))

  return {
    historyRecord: normalizeHistoryRecord(response.data.historyRecord),
  }
}

export async function deleteRecipeHistoryRequest(id) {
  await apiClient.delete(`/recipe-history/${id}`)
}
