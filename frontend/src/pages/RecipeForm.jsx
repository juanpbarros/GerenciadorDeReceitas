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
      <h2 className="text-lg font-semibold">{isEdit ? 'Editar receita' : 'Nova receita'}</h2>
      <p className="mt-1 text-sm text-slate-600">
        Formulário inicial (ainda sem salvar no backend).
      </p>

      <form className="mt-6 space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-700" htmlFor="title">Título</label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-slate-900/10 focus:ring-4"
            placeholder="Ex: Bolo de chocolate"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700" htmlFor="category">Categoria</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-slate-900/10 focus:ring-4"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          Próxima etapa: campos dinâmicos para ingredientes e modo de preparo (listas de strings).
        </div>
      </form>
    </div>
  )
}

