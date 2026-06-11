const initialForm = {
  recipeId: '',
  date: '',
  observation: '',
  personalRating: '',
}

export { initialForm }

export default function HistoryForm({
  form,
  isSubmitting,
  onCancel,
  onChange,
  onSubmit,
  recipes,
  submitLabel = 'Salvar histórico',
}) {
  return (
    <form className="row g-3" onSubmit={onSubmit}>
      <div className="col-12 col-lg-8">
        <label className="form-label" htmlFor="history-recipe">Receita feita</label>
        <select
          id="history-recipe"
          className="form-select"
          value={form.recipeId}
          onChange={(event) => onChange('recipeId', event.target.value)}
        >
          <option value="">Selecione uma receita</option>
          {recipes.map((recipe) => (
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
          onChange={(event) => onChange('date', event.target.value)}
        />
      </div>

      <div className="col-12 col-lg-4">
        <label className="form-label" htmlFor="history-rating">Nota pessoal opcional</label>
        <select
          id="history-rating"
          className="form-select"
          value={form.personalRating}
          onChange={(event) => onChange('personalRating', event.target.value)}
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
          onChange={(event) => onChange('observation', event.target.value)}
          placeholder="Ex: Fiz metade da receita e funcionou bem."
        />
      </div>

      <div className="col-12 d-flex flex-wrap gap-2 justify-content-end">
        {onCancel && (
          <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>
            Cancelar edição
          </button>
        )}
        <button type="submit" className="btn btn-dark" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : submitLabel}
        </button>
      </div>
    </form>
  )
}
