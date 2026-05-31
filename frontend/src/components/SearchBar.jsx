import { Form, InputGroup } from 'react-bootstrap'

export default function SearchBar({ value, onChange, placeholder = 'Buscar receitas...' }) {
  return (
    <InputGroup>
      <InputGroup.Text>Buscar</InputGroup.Text>
      <Form.Control
        type="text"
        aria-label="Buscar receitas"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <InputGroup.Text
          role="button"
          onClick={() => onChange('')}
          style={{ cursor: 'pointer' }}
        >
          Limpar
        </InputGroup.Text>
      )}
    </InputGroup>
  )
}

