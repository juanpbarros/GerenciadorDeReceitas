import { useState } from 'react'

export default function CommentForm() {
  const [text, setText] = useState('')
  const [rating, setRating] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!text.trim() || !rating) {
      setMessage('Preencha o comentário e selecione uma nota.')
      return
    }

    setMessage('Comentário pronto para integração com o backend.')
  }

  return (
    <form className="border rounded-3 p-3" onSubmit={handleSubmit}>
      <h3 className="h6 mb-3">Comentário e avaliação</h3>

      {message && (
        <div role="alert" className={`alert ${message.includes('pronto') ? 'alert-success' : 'alert-warning'} py-2`}>
          {message}
        </div>
      )}

      <div className="mb-3">
        <label className="form-label" htmlFor="comment-text">Comentário</label>
        <textarea
          id="comment-text"
          className="form-control"
          rows="3"
          value={text}
          onChange={(event) => {
            setText(event.target.value)
            setMessage('')
          }}
          placeholder="Conte como ficou a receita"
        />
      </div>

      <div className="mb-3">
        <label className="form-label" htmlFor="comment-rating">Nota</label>
        <select
          id="comment-rating"
          className="form-select"
          value={rating}
          onChange={(event) => {
            setRating(event.target.value)
            setMessage('')
          }}
        >
          <option value="">Selecione uma nota</option>
          <option value="1">1 - Ruim</option>
          <option value="2">2 - Regular</option>
          <option value="3">3 - Boa</option>
          <option value="4">4 - Muito boa</option>
          <option value="5">5 - Excelente</option>
        </select>
      </div>

      <div className="d-flex justify-content-end">
        <button type="submit" className="btn btn-dark">
          Enviar avaliação
        </button>
      </div>
    </form>
  )
}

