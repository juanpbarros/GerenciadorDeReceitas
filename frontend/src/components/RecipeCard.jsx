import { Link } from 'react-router-dom'
import { Card } from 'react-bootstrap'
import StarRating from './StarRating'

export default function RecipeCard({ recipe }) {
  return (
    <Card as={Link} to={`/receitas/${recipe._id}`} className="text-decoration-none h-100 border-0 shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <span className="badge bg-dark bg-opacity-10 text-dark">{recipe.categoria?.nome}</span>
          <StarRating rating={recipe.avaliacaoMedia} />
        </div>
        <Card.Title className="text-dark mb-1">{recipe.nome}</Card.Title>
        <Card.Text className="text-muted small mb-3">{recipe.descricao}</Card.Text>
        <div className="text-muted small">
          {recipe.tempoPreparo}min · {recipe.porcoes} porções
        </div>
      </Card.Body>
    </Card>
  )
}
