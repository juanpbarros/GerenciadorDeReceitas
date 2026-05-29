import { Link, useParams } from 'react-router-dom'

export default function RecipeDetail() {
  const { id } = useParams()

  return (
    <div>
      <div className="d-flex align-items-start align-items-md-center justify-content-between gap-3">
        <div>
          <h2 className="h4 mb-1">Detalhes da receita</h2>
          <p className="text-secondary mb-0">Receita: {id}</p>
        </div>
        <Link to={`/receitas/${id}/editar`} className="btn btn-outline-dark">
          Editar
        </Link>
      </div>

      <div className="mt-4 p-4 bg-light border rounded-4">
        Próximas etapas: exibir ingredientes e modo de preparo, comentários e “Fazer receita” com checklist.
      </div>
    </div>
  )
}

