import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import FilterBar from '../components/FilterBar'
import RecipeCard from '../components/RecipeCard'
import SearchBar from '../components/SearchBar'
import { RECIPE_CATEGORIES } from '../data/mockRecipes'
import { useAuth } from '../hooks/useAuth'
import {
  addFavoriteRequest,
  listFavoritesRequest,
  removeFavoriteRequest,
} from '../services/favoriteApi'
import { listRecipesRequest } from '../services/recipeApi'

export default function Recipes() {
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [recipes, setRecipes] = useState([])
  const [favoriteIds, setFavoriteIds] = useState([])
  const [favoriteLoadingId, setFavoriteLoadingId] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadRecipes() {
      setIsLoading(true)
      setError('')

      try {
        const [{ recipes: apiRecipes }, { favorites }] = await Promise.all([
          listRecipesRequest({
            busca: search.trim(),
            categoria: category,
          }),
          listFavoritesRequest(),
        ])

        if (isMounted) {
          setRecipes(apiRecipes)
          setFavoriteIds(favorites.map((favorite) => favorite.recipeId))
        }
      } catch {
        if (isMounted) setError('Não foi possível carregar as receitas.')
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadRecipes()

    return () => {
      isMounted = false
    }
  }, [category, search])

  const handleToggleFavorite = async (recipe) => {
    const isFavorite = favoriteIds.includes(recipe.id)

    setFavoriteLoadingId(recipe.id)
    setError('')

    try {
      if (isFavorite) {
        await removeFavoriteRequest(recipe.id)
        setFavoriteIds((currentIds) => currentIds.filter((id) => id !== recipe.id))
      } else {
        await addFavoriteRequest(recipe.id)
        setFavoriteIds((currentIds) => [...new Set([...currentIds, recipe.id])])
      }
    } catch {
      setError('Não foi possível atualizar o favorito.')
    } finally {
      setFavoriteLoadingId('')
    }
  }

  return (
    <div>
      <div className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3 mb-4">
        <div>
          <h2 className="h4 mb-1">Minha biblioteca de receitas</h2>
          <p className="text-secondary mb-0">
            Organize suas receitas e as receitas adicionadas por compartilhamento.
          </p>
        </div>
        <Link to="/receitas/nova" className="btn btn-dark align-self-start align-self-lg-center">
          + Nova receita
        </Link>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-lg-8">
          <SearchBar value={search} onChange={setSearch} />
        </div>
        <div className="col-12 col-lg-4">
          <FilterBar value={category} onChange={setCategory} categories={RECIPE_CATEGORIES} />
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <span className="text-secondary small">
          {recipes.length} receita{recipes.length === 1 ? '' : 's'} encontrada{recipes.length === 1 ? '' : 's'}
        </span>
      </div>

      {isLoading && (
        <div className="empty-state border rounded-3 bg-light p-4 text-center">
          <div className="spinner-border text-dark" role="status" aria-label="Carregando receitas" />
          <p className="text-secondary mt-3 mb-0">Carregando receitas...</p>
        </div>
      )}

      {error && !isLoading && (
        <div role="alert" className="alert alert-danger">
          {error}
        </div>
      )}

      {!isLoading && !error && recipes.length > 0 ? (
        <div className="row g-3" aria-label="Lista de receitas">
          {recipes.map((recipe) => (
            <div className="col-12 col-md-6 col-xl-4" key={recipe.id}>
              <RecipeCard
                recipe={recipe}
                currentUserId={user?._id}
                isFavorite={favoriteIds.includes(recipe.id)}
                isFavoriteLoading={favoriteLoadingId === recipe.id}
                onToggleFavorite={() => handleToggleFavorite(recipe)}
              />
            </div>
          ))}
        </div>
      ) : !isLoading && !error && (
        <div className="empty-state border rounded-3 bg-light p-4 text-center">
          <h3 className="h6 mb-1">Nenhuma receita encontrada</h3>
          <p className="text-secondary mb-0">Tente limpar a busca ou escolher outra categoria.</p>
        </div>
      )}
    </div>
  )
}
