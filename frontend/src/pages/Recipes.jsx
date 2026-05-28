import { Link } from 'react-router-dom'

export default function Recipes() {
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Receitas</h2>
          <p className="mt-1 text-sm text-slate-600">Listagem (mock por enquanto).</p>
        </div>
        <Link
          to="/receitas/nova"
          className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800"
        >
          + Nova receita
        </Link>
      </div>

      <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-700">
        Próxima etapa: criar UI de cards, busca, filtro por categoria e detalhes.
      </div>
    </div>
  )
}

