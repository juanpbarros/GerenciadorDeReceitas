import { useState, useMemo } from 'react'
import { Row, Col } from 'react-bootstrap'
import { useRecipes } from '../contexts/RecipeContext'
import RecipeCard from '../components/RecipeCard'
import SearchBar from '../components/SearchBar'
import FilterBar from '../components/FilterBar'

export default function Home() {
  const { recipes } = useRecipes()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')

  const filtered = useMemo(() => {
    return recipes.filter((r) => {
      const matchSearch = r.nome.toLowerCase().includes(search.toLowerCase()) ||
        r.descricao?.toLowerCase().includes(search.toLowerCase())
      const matchCategory = !category || r.categoria?.nome === category
      return matchSearch && matchCategory
    })
  }, [recipes, search, category])

  return (
    <div>
      <h2 className="mb-4">Receitas</h2>
      <Row className="mb-4">
        <Col md={8} className="mb-2 mb-md-0">
          <SearchBar value={search} onChange={setSearch} />
        </Col>
        <Col md={4}>
          <FilterBar value={category} onChange={setCategory} />
        </Col>
      </Row>
      <Row xs={1} sm={2} lg={3} className="g-3">
        {filtered.map((recipe) => (
          <Col key={recipe._id}>
            <RecipeCard recipe={recipe} />
          </Col>
        ))}
      </Row>
      {filtered.length === 0 && (
        <p className="text-muted text-center mt-4">Nenhuma receita encontrada.</p>
      )}
    </div>
  )
}
