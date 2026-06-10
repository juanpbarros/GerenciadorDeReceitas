import { apiClient } from './apiClient'

export function normalizeComment(comment) {
  const user = comment.usuario

  return {
    id: comment._id || comment.id,
    recipeId: comment.receita,
    userId: typeof user === 'object' && user !== null ? user._id : user,
    userName: typeof user === 'object' && user !== null ? user.nome : 'Usuário',
    text: comment.texto,
    rating: comment.nota,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
  }
}

export async function listCommentsRequest(recipeId) {
  const response = await apiClient.get('/comments', {
    params: recipeId ? { receita: recipeId } : undefined,
  })

  return {
    comments: response.data.comments.map(normalizeComment),
  }
}
