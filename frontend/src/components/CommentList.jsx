import { useState } from 'react'
import StarRating from './StarRating'

export default function CommentList({ comments, currentUserId, error, isLoading, onDelete, onUpdate }) {
  const [editingId, setEditingId] = useState(null)
  const [draftText, setDraftText] = useState('')
  const [draftRating, setDraftRating] = useState('5')
  const [actionError, setActionError] = useState('')
  const [pendingActionId, setPendingActionId] = useState('')

  if (isLoading) {
    return (
      <div className="border rounded-3 p-3 text-center text-secondary">
        <div className="spinner-border spinner-border-sm me-2" role="status" aria-label="Carregando comentários" />
        Carregando comentários...
      </div>
    )
  }

  if (error) {
    return (
      <div role="alert" className="alert alert-warning">
        {error}
      </div>
    )
  }

  if (comments.length === 0) {
    return (
      <div className="border rounded-3 p-3 text-secondary">
        Nenhum comentário cadastrado para esta receita.
      </div>
    )
  }

  const startEditing = (comment) => {
    setEditingId(comment.id)
    setDraftText(comment.text)
    setDraftRating(String(comment.rating))
    setActionError('')
  }

  const cancelEditing = () => {
    setEditingId(null)
    setDraftText('')
    setDraftRating('5')
    setActionError('')
  }

  const saveComment = async (commentId) => {
    if (!draftText.trim() || !draftRating) {
      setActionError('Preencha o comentário e selecione uma nota.')
      return
    }

    setPendingActionId(commentId)
    setActionError('')

    try {
      await onUpdate(commentId, { text: draftText.trim(), rating: Number(draftRating) })
      cancelEditing()
    } catch {
      setActionError('Não foi possível atualizar o comentário.')
    } finally {
      setPendingActionId('')
    }
  }

  const deleteComment = async (commentId) => {
    setPendingActionId(commentId)
    setActionError('')

    try {
      await onDelete(commentId)
      if (editingId === commentId) cancelEditing()
    } catch {
      setActionError('Não foi possível excluir o comentário.')
    } finally {
      setPendingActionId('')
    }
  }

  return (
    <>
      {actionError && (
        <div role="alert" className="alert alert-warning">
          {actionError}
        </div>
      )}

      <div className="d-grid gap-3">
        {comments.map((comment) => {
          const isOwner = String(comment.userId) === String(currentUserId)
          const isEditing = editingId === comment.id
          const isPending = pendingActionId === comment.id

          return (
            <article className="border rounded-3 p-3 bg-white" key={comment.id}>
              <div className="d-flex flex-column flex-sm-row justify-content-between gap-2 mb-2">
                <strong>{comment.userName}</strong>
                <StarRating rating={comment.rating} />
              </div>

              {isEditing ? (
                <div className="d-grid gap-3">
                  <div>
                    <label className="form-label" htmlFor={`comment-edit-text-${comment.id}`}>Comentário editado</label>
                    <textarea
                      id={`comment-edit-text-${comment.id}`}
                      className="form-control"
                      rows="3"
                      value={draftText}
                      onChange={(event) => setDraftText(event.target.value)}
                    />
                  </div>

                  <div>
                    <label className="form-label" htmlFor={`comment-edit-rating-${comment.id}`}>Nota editada</label>
                    <select
                      id={`comment-edit-rating-${comment.id}`}
                      className="form-select"
                      value={draftRating}
                      onChange={(event) => setDraftRating(event.target.value)}
                    >
                      <option value="1">1 - Ruim</option>
                      <option value="2">2 - Regular</option>
                      <option value="3">3 - Boa</option>
                      <option value="4">4 - Muito boa</option>
                      <option value="5">5 - Excelente</option>
                    </select>
                  </div>

                  <div className="d-flex flex-wrap gap-2 justify-content-end">
                    <button type="button" className="btn btn-outline-secondary btn-sm" onClick={cancelEditing}>
                      Cancelar
                    </button>
                    <button
                      type="button"
                      className="btn btn-dark btn-sm"
                      disabled={isPending}
                      onClick={() => saveComment(comment.id)}
                    >
                      {isPending ? 'Salvando...' : 'Salvar comentário'}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="mb-0 text-secondary">{comment.text}</p>

                  {isOwner && (
                    <div className="d-flex flex-wrap gap-2 justify-content-end mt-3">
                      <button type="button" className="btn btn-outline-dark btn-sm" onClick={() => startEditing(comment)}>
                        Editar comentário
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        disabled={isPending}
                        onClick={() => deleteComment(comment.id)}
                      >
                        {isPending ? 'Excluindo...' : 'Excluir comentário'}
                      </button>
                    </div>
                  )}
                </>
              )}
            </article>
          )
        })}
      </div>
    </>
  )
}
