import { Button, Row, Col, Form } from 'react-bootstrap'

export default function IngredientInput({ ingredients, onChange }) {
  const add = () => {
    onChange([...ingredients, { nome: '', quantidade: '' }])
  }

  const remove = (index) => {
    onChange(ingredients.filter((_, i) => i !== index))
  }

  const update = (index, field, value) => {
    const updated = ingredients.map((ing, i) =>
      i === index ? { ...ing, [field]: value } : ing
    )
    onChange(updated)
  }

  return (
    <div>
      <label className="form-label">Ingredientes</label>
      {ingredients.map((ing, i) => (
        <Row key={i} className="mb-2">
          <Col>
            <Form.Control
              placeholder="Nome do ingrediente"
              value={ing.nome}
              onChange={(e) => update(i, 'nome', e.target.value)}
            />
          </Col>
          <Col>
            <Form.Control
              placeholder="Quantidade"
              value={ing.quantidade}
              onChange={(e) => update(i, 'quantidade', e.target.value)}
            />
          </Col>
          <Col xs="auto">
            <Button variant="outline-danger" onClick={() => remove(i)}>
              ✕
            </Button>
          </Col>
        </Row>
      ))}
      <Button variant="outline-secondary" size="sm" onClick={add}>
        + Adicionar ingrediente
      </Button>
    </div>
  )
}
