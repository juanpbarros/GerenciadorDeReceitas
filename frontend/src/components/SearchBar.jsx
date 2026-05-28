import { Form, InputGroup } from 'react-bootstrap'

export default function SearchBar({ value, onChange, placeholder = 'Buscar receitas...' }) {
  return (
    <InputGroup>
      <InputGroup.Text>🔍</InputGroup.Text>
      <Form.Control
        type="text"
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
          ✕
        </InputGroup.Text>
      )}
    </InputGroup>
  )
}
