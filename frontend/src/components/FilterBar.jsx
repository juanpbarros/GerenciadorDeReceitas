import { Form } from 'react-bootstrap'

export default function FilterBar({ value, onChange, categories = [] }) {
  return (
    <Form.Select aria-label="Filtrar por categoria" value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">Todas as categorias</option>
      {categories.map((category) => (
        <option key={category} value={category}>{category}</option>
      ))}
    </Form.Select>
  )
}

