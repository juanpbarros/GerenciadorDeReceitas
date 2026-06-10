import StarRating from './StarRating'

export default function CommentList({ comments, error, isLoading }) {
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

  return (
    <div className="d-grid gap-3">
      {comments.map((comment) => (
        <article className="border rounded-3 p-3 bg-white" key={comment.id}>
          <div className="d-flex flex-column flex-sm-row justify-content-between gap-2 mb-2">
            <strong>{comment.userName}</strong>
            <StarRating rating={comment.rating} />
          </div>
          <p className="mb-0 text-secondary">{comment.text}</p>
        </article>
      ))}
    </div>
  )
}
