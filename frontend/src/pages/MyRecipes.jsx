import { useState, useMemo } from 'react'
import { Row, Col, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useRecipes } from '../contexts/RecipeContext'
import RecipeCard from '../components/RecipeCard'
import SearchBar from '../components/SearchBar'
import FilterBar from '../components/FilterBar'

export default function MyRecipes() {
  const { user } = useAuth()
  const { recipes } = useRecipes()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')

  const myRecipes = useMemo(() => {
    return recipes.filter((r) => {
      const matchUser = r.usuario === user?.nome
      const matchSearch = r.nome.toLowerCase().includes(search.toLowerCase())
      const matchCategory = !category || r.categoria?.nome === category
      return matchUser && matchSearch && matchCategory
    })
  }, [recipes, user, search, category])

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Minhas Receitas</h2>
        <Button as={Link} to="/receitas/nova" variant="dark">
          + Nova Receita
        </Button>
      </div>
      <Row className="mb-4">
        <Col md={8} className="mb-2 mb-md-0">
          <SearchBar value={search} onChange={setSearch} placeholder="Buscar nas minhas receitas..." />
        </Col>
        <Col md={4}>
          <FilterBar value={category} onChange={setCategory} />
        </Col>
      </Row>
      <Row xs={1} sm={2} lg={3} className="g-3">
        {myRecipes.map((recipe) => (
          <Col key={recipe._id}>
            <RecipeCard recipe={recipe} />
          </Col>
        ))}
      </Row>
      {myRecipes.length === 0 && (
        <p className="text-muted text-center mt-4">
          Você ainda não tem receitas.{' '}
          <Link to="/receitas/nova">Criar primeira receita</Link>
        </p>
      )}
    </div>
  )
}
