import { useState } from 'react'
import { Card, Button, ListGroup, Form, Row, Col } from 'react-bootstrap'
import { useRecipes } from '../contexts/RecipeContext'

export default function Ingredients() {
  const { ingredients, addIngredient, updateIngredient, deleteIngredient } = useRecipes()
  const [newName, setNewName] = useState('')
  const [newUnidade, setNewUnidade] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editUnidade, setEditUnidade] = useState('')

  const handleAdd = (e) => {
    e.preventDefault()
    if (!newName.trim()) return
    addIngredient({ nome: newName.trim(), unidade: newUnidade.trim() })
    setNewName('')
    setNewUnidade('')
  }

  const handleEdit = (ing) => {
    setEditingId(ing._id)
    setEditName(ing.nome)
    setEditUnidade(ing.unidade || '')
  }

  const handleSaveEdit = () => {
    updateIngredient(editingId, { nome: editName.trim(), unidade: editUnidade.trim() })
    setEditingId(null)
  }

  return (
    <div>
      <h2 className="mb-4">Ingredientes</h2>

      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Form onSubmit={handleAdd}>
            <Row>
              <Col>
                <Form.Control
                  placeholder="Nome do ingrediente"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </Col>
              <Col>
                <Form.Control
                  placeholder="Unidade (ex: xícara, ml, unidade)"
                  value={newUnidade}
                  onChange={(e) => setNewUnidade(e.target.value)}
                />
              </Col>
              <Col xs="auto">
                <Button type="submit" variant="dark">Adicionar</Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      <ListGroup>
        {ingredients.map((ing) => (
          <ListGroup.Item key={ing._id} className="d-flex justify-content-between align-items-center">
            {editingId === ing._id ? (
              <Row className="flex-grow-1 align-items-center">
                <Col>
                  <Form.Control value={editName} onChange={(e) => setEditName(e.target.value)} />
                </Col>
                <Col>
                  <Form.Control value={editUnidade} onChange={(e) => setEditUnidade(e.target.value)} />
                </Col>
                <Col xs="auto">
                  <Button size="sm" variant="dark" className="me-2" onClick={handleSaveEdit}>Salvar</Button>
                  <Button size="sm" variant="outline-secondary" onClick={() => setEditingId(null)}>Cancelar</Button>
                </Col>
              </Row>
            ) : (
              <>
                <span>{ing.nome} {ing.unidade && <small className="text-muted">({ing.unidade})</small>}</span>
                <div>
                  <Button size="sm" variant="outline-dark" className="me-2" onClick={() => handleEdit(ing)}>Editar</Button>
                  <Button size="sm" variant="outline-danger" onClick={() => deleteIngredient(ing._id)}>Excluir</Button>
                </div>
              </>
            )}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  )
}
