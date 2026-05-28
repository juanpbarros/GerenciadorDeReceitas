import { Form } from 'react-bootstrap'
import { useRecipes } from '../contexts/RecipeContext'

export default function FilterBar({ value, onChange }) {
  const { categories } = useRecipes()

  return (
    <Form.Select value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">Todas as categorias</option>
      {categories.map((cat) => (
        <option key={cat._id} value={cat.nome}>{cat.nome}</option>
      ))}
    </Form.Select>
  )
}
