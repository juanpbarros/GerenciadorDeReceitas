import { Link, useParams } from 'react-router-dom'

export default function RecipeDetail() {
  const { id } = useParams()

  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Detalhes da receita</h2>
          <p className="mt-1 text-sm text-slate-600">Receita: {id}</p>
        </div>
        <Link
          to={`/receitas/${id}/editar`}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
        >
          Editar
        </Link>
      </div>

      <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-700">
        Próximas etapas: exibir ingredientes e modo de preparo, comentários e “Fazer receita” com checklist.
      </div>
    </div>
  )
}

