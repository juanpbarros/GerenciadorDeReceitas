import { useState } from 'react'

const CATEGORIES = [
  'Café da manhã',
  'Almoço',
  'Jantar',
  'Sobremesa',
  'Massas',
  'Bebidas',
  'Saladas',
  'Lanches',
]

export default function RecipeForm({ mode }) {
  const isEdit = mode === 'edit'
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])

  return (
    <div>
      <h2 className="h4 mb-1">{isEdit ? 'Editar receita' : 'Nova receita'}</h2>
      <p className="text-secondary mb-4">Formulário inicial (ainda sem salvar no backend).</p>

      <form className="row g-3">
        <div className="col-12">
          <label className="form-label" htmlFor="title">Título</label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
            placeholder="Ex: Bolo de chocolate"
          />
        </div>

        <div className="col-12 col-md-6">
          <label className="form-label" htmlFor="category">Categoria</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="form-select"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="col-12">
          <div className="p-3 bg-light border rounded-4">
            Próxima etapa: campos dinâmicos para ingredientes e modo de preparo (listas de strings).
          </div>
        </div>
      </form>
    </div>
  )
}

