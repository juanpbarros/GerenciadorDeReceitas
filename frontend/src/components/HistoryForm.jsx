import { useMemo, useState } from 'react'
import { MOCK_RECIPES } from '../data/mockRecipes'

const initialForm = {
  recipeId: '',
  date: '',
  observation: '',
  personalRating: '',
}

export default function HistoryForm() {
  const [form, setForm] = useState(initialForm)
  const [message, setMessage] = useState('')

  const cleanPreview = useMemo(() => ({
    recipeId: form.recipeId,
    date: form.date,
    observation: form.observation.trim(),
    personalRating: form.personalRating ? Number(form.personalRating) : null,
  }), [form])

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
    setMessage('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!cleanPreview.recipeId || !cleanPreview.date) {
      setMessage('Selecione uma receita e informe a data em que ela foi feita.')
      return
    }

    setMessage('Registro de histórico pronto para integração com o backend.')
  }

  return (
    <form className="row g-3" onSubmit={handleSubmit}>
      {message && (
        <div className="col-12">
          <div role="alert" className={`alert ${message.includes('pronto') ? 'alert-success' : 'alert-warning'}`}>
            {message}
          </div>
        </div>
      )}

      <div className="col-12 col-lg-8">
        <label className="form-label" htmlFor="history-recipe">Receita feita</label>
        <select
          id="history-recipe"
          className="form-select"
          value={form.recipeId}
          onChange={(event) => updateField('recipeId', event.target.value)}
        >
          <option value="">Selecione uma receita</option>
          {MOCK_RECIPES.map((recipe) => (
            <option key={recipe.id} value={recipe.id}>{recipe.title}</option>
          ))}
        </select>
      </div>

      <div className="col-12 col-lg-4">
        <label className="form-label" htmlFor="history-date">Data</label>
        <input
          id="history-date"
          type="date"
          className="form-control"
          value={form.date}
          onChange={(event) => updateField('date', event.target.value)}
        />
      </div>

      <div className="col-12 col-lg-4">
        <label className="form-label" htmlFor="history-rating">Nota pessoal opcional</label>
        <select
          id="history-rating"
          className="form-select"
          value={form.personalRating}
          onChange={(event) => updateField('personalRating', event.target.value)}
        >
          <option value="">Sem nota</option>
          <option value="1">1 - Não faria novamente</option>
          <option value="2">2 - Pode melhorar</option>
          <option value="3">3 - Boa</option>
          <option value="4">4 - Muito boa</option>
          <option value="5">5 - Excelente</option>
        </select>
      </div>

      <div className="col-12">
        <label className="form-label" htmlFor="history-observation">Observação opcional</label>
        <textarea
          id="history-observation"
          className="form-control"
          rows="3"
          value={form.observation}
          onChange={(event) => updateField('observation', event.target.value)}
          placeholder="Ex: Fiz metade da receita e funcionou bem."
        />
      </div>

      <div className="col-12 d-flex justify-content-end">
        <button type="submit" className="btn btn-dark">
          Salvar histórico
        </button>
      </div>
    </form>
  )
}
