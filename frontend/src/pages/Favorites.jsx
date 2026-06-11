import { useEffect, useState } from 'react'
import RecipeCard from '../components/RecipeCard'
import {
  listFavoritesRequest,
  removeFavoriteRequest,
} from '../services/favoriteApi'

export default function Favorites() {
  const [favorites, setFavorites] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [favoriteLoadingId, setFavoriteLoadingId] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadFavorites() {
      setIsLoading(true)
      setError('')

      try {
        const { favorites: apiFavorites } = await listFavoritesRequest()
        if (isMounted) setFavorites(apiFavorites.filter((favorite) => favorite.recipe))
      } catch {
        if (isMounted) setError('Não foi possível carregar os favoritos.')
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadFavorites()

    return () => {
      isMounted = false
    }
  }, [])

  const handleRemoveFavorite = async (recipeId) => {
    setFavoriteLoadingId(recipeId)
    setError('')

    try {
      await removeFavoriteRequest(recipeId)
      setFavorites((currentFavorites) => currentFavorites.filter((favorite) => favorite.recipeId !== recipeId))
    } catch {
      setError('Não foi possível remover o favorito.')
    } finally {
      setFavoriteLoadingId('')
    }
  }

  return (
    <div>
      <div className="mb-4">
        <h2 className="h4 mb-1">Favoritos</h2>
        <p className="text-secondary mb-0">Acesse rapidamente as receitas marcadas com estrela.</p>
      </div>

      {isLoading && (
        <div className="empty-state border rounded-3 bg-light p-4 text-center">
          <div className="spinner-border text-dark" role="status" aria-label="Carregando favoritos" />
          <p className="text-secondary mt-3 mb-0">Carregando favoritos...</p>
        </div>
      )}

      {error && !isLoading && (
        <div role="alert" className="alert alert-danger">
          {error}
        </div>
      )}

      {!isLoading && !error && favorites.length > 0 ? (
        <div className="row g-3" aria-label="Lista de favoritos">
          {favorites.map((favorite) => (
            <div className="col-12 col-md-6 col-xl-4" key={favorite.id}>
              <RecipeCard
                recipe={favorite.recipe}
                isFavorite
                isFavoriteLoading={favoriteLoadingId === favorite.recipeId}
                onToggleFavorite={() => handleRemoveFavorite(favorite.recipeId)}
              />
            </div>
          ))}
        </div>
      ) : !isLoading && !error && (
        <div className="empty-state border rounded-3 bg-light p-4 text-center">
          <h3 className="h6 mb-1">Nenhum favorito ainda</h3>
          <p className="text-secondary mb-0">Use a estrela nas receitas para montar sua lista de favoritos.</p>
        </div>
      )}
    </div>
  )
}
