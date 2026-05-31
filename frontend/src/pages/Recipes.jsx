import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import FilterBar from '../components/FilterBar'
import RecipeCard from '../components/RecipeCard'
import SearchBar from '../components/SearchBar'
import { MOCK_RECIPES, RECIPE_CATEGORIES } from '../data/mockRecipes'

export default function Recipes() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')

  const filteredRecipes = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return MOCK_RECIPES.filter((recipe) => {
      const matchesSearch = !normalizedSearch
        || recipe.title.toLowerCase().includes(normalizedSearch)
        || recipe.description.toLowerCase().includes(normalizedSearch)

      const matchesCategory = !category || recipe.category === category

      return matchesSearch && matchesCategory
    })
  }, [category, search])

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
          {filteredRecipes.length} receita{filteredRecipes.length === 1 ? '' : 's'} encontrada{filteredRecipes.length === 1 ? '' : 's'}
        </span>
      </div>

      {filteredRecipes.length > 0 ? (
        <div className="row g-3" aria-label="Lista de receitas">
          {filteredRecipes.map((recipe) => (
            <div className="col-12 col-md-6 col-xl-4" key={recipe.id}>
              <RecipeCard recipe={recipe} />
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state border rounded-3 bg-light p-4 text-center">
          <h3 className="h6 mb-1">Nenhuma receita encontrada</h3>
          <p className="text-secondary mb-0">Tente limpar a busca ou escolher outra categoria.</p>
        </div>
      )}
    </div>
  )
}

