import { Link } from 'react-router-dom'
import FavoriteButton from './FavoriteButton'
import StarRating from './StarRating'

export default function RecipeCard({
  isFavorite = false,
  isFavoriteLoading = false,
  onToggleFavorite,
  recipe,
}) {
  return (
    <article className="recipe-card h-100">
      <div className="recipe-card-body">
        <div className="d-flex justify-content-between align-items-start gap-2 mb-3">
          <span className="badge text-bg-light border">{recipe.category}</span>
          {onToggleFavorite ? (
            <FavoriteButton
              isFavorite={isFavorite}
              isLoading={isFavoriteLoading}
              recipeTitle={recipe.title}
              onToggle={onToggleFavorite}
            />
          ) : (
            <StarRating rating={recipe.rating} />
          )}
        </div>
        <Link to={`/receitas/${recipe.id}`} className="d-block text-decoration-none text-dark">
          <h3 className="h5 mb-2">{recipe.title}</h3>
          <p className="text-secondary small mb-3">{recipe.description}</p>
          <div className="d-flex flex-wrap gap-2 small text-secondary">
            <span>{recipe.prepTimeMinutes} min</span>
            <span>•</span>
            <span>{recipe.ingredients.length} ingredientes</span>
            {recipe.origin === 'imported' && recipe.sourceName && (
              <>
                <span>•</span>
                <span>Receita de {recipe.sourceName}</span>
              </>
            )}
          </div>
        </Link>
      </div>
    </article>
  )
}
