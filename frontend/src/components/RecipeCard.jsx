import { Link } from 'react-router-dom'
import StarRating from './StarRating'

export default function RecipeCard({ recipe }) {
  return (
    <Link to={`/receitas/${recipe.id}`} className="recipe-card d-block h-100 text-decoration-none text-dark">
      <div className="recipe-card-body">
        <div className="d-flex justify-content-between align-items-start gap-2 mb-3">
          <span className="badge text-bg-light border">{recipe.category}</span>
          <StarRating rating={recipe.rating} />
        </div>
        <h3 className="h5 mb-2">{recipe.title}</h3>
        <p className="text-secondary small mb-3">{recipe.description}</p>
        <div className="d-flex flex-wrap gap-2 small text-secondary">
          <span>{recipe.prepTimeMinutes} min</span>
          <span>•</span>
          <span>{recipe.ingredients.length} ingredientes</span>
          <span>•</span>
          <span>{recipe.creator}</span>
        </div>
      </div>
    </Link>
  )
}

