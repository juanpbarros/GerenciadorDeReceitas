import { Link } from 'react-router-dom'

export default function Recipes() {
  return (
    <div>
      <div className="d-flex align-items-start align-items-md-center justify-content-between gap-3">
        <div>
          <h2 className="h4 mb-1">Receitas</h2>
          <p className="text-secondary mb-0">Listagem (mock por enquanto).</p>
        </div>
        <Link to="/receitas/nova" className="btn btn-dark">
          + Nova receita
        </Link>
      </div>

      <div className="mt-4 p-4 bg-light border rounded-4">
        Próxima etapa: criar UI de cards, busca, filtro por categoria e detalhes.
      </div>
    </div>
  )
}

