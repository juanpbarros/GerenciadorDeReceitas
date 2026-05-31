import { Link, useParams } from 'react-router-dom'
import { MOCK_RECIPES } from '../data/mockRecipes'

export default function RecipeDetail() {
  const { id } = useParams()
  const recipe = MOCK_RECIPES.find((item) => item.id === id)

  if (!recipe) {
    return (
      <div className="text-center py-4">
        <h2 className="h4 mb-2">Receita não encontrada</h2>
        <p className="text-secondary mb-4">A receita selecionada não existe nos dados de demonstração.</p>
        <Link to="/receitas" className="btn btn-dark">Voltar para receitas</Link>
      </div>
    )
  }

  return (
    <div>
      <div className="d-flex flex-column flex-md-row align-items-md-start justify-content-between gap-3 mb-4">
        <div>
          <span className="badge text-bg-light border mb-2">{recipe.category}</span>
          <h2 className="h4 mb-1">{recipe.title}</h2>
          <p className="text-secondary mb-0">{recipe.description}</p>
          {recipe.origin === 'imported' && recipe.sourceName && (
            <p className="text-secondary small mt-2 mb-0">Receita de {recipe.sourceName}</p>
          )}
        </div>
        <Link to={`/receitas/${id}/editar`} className="btn btn-outline-dark">
          Editar
        </Link>
      </div>

      <div className="row g-4">
        <section className="col-12 col-lg-5">
          <h3 className="h6">Ingredientes</h3>
          <ul className="list-group list-group-flush border rounded-3">
            {recipe.ingredients.map((ingredient) => (
              <li className="list-group-item" key={ingredient}>{ingredient}</li>
            ))}
          </ul>
        </section>

        <section className="col-12 col-lg-7">
          <h3 className="h6">Modo de preparo</h3>
          <ol className="list-group list-group-numbered border rounded-3">
            {recipe.preparationSteps.map((step) => (
              <li className="list-group-item" key={step}>{step}</li>
            ))}
          </ol>
        </section>
      </div>

      <div className="mt-4 p-3 bg-light border rounded-3 d-flex flex-wrap gap-3 text-secondary small">
        <span>Tempo: {recipe.prepTimeMinutes} min</span>
        <span>Nota: {recipe.rating}</span>
      </div>
    </div>
  )
}

