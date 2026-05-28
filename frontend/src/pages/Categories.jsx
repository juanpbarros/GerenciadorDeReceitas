import { useState } from 'react'
import { Card, Button, ListGroup, Form, Row, Col } from 'react-bootstrap'
import { useRecipes } from '../contexts/RecipeContext'

export default function Categories() {
  const { categories, addCategory, updateCategory, deleteCategory } = useRecipes()
  const [newName, setNewName] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')

  const handleAdd = (e) => {
    e.preventDefault()
    if (!newName.trim()) return
    addCategory({ nome: newName.trim() })
    setNewName('')
  }

  const handleEdit = (id) => {
    const cat = categories.find((c) => c._id === id)
    setEditingId(id)
    setEditName(cat.nome)
  }

  const handleSaveEdit = (id) => {
    updateCategory(id, { nome: editName.trim() })
    setEditingId(null)
  }

  return (
    <div>
      <h2 className="mb-4">Categorias</h2>

      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Form onSubmit={handleAdd}>
            <Row>
              <Col>
                <Form.Control
                  placeholder="Nova categoria"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
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
        {categories.map((cat) => (
          <ListGroup.Item key={cat._id} className="d-flex justify-content-between align-items-center">
            {editingId === cat._id ? (
              <Row className="flex-grow-1 align-items-center">
                <Col>
                  <Form.Control value={editName} onChange={(e) => setEditName(e.target.value)} />
                </Col>
                <Col xs="auto">
                  <Button size="sm" variant="dark" className="me-2" onClick={() => handleSaveEdit(cat._id)}>Salvar</Button>
                  <Button size="sm" variant="outline-secondary" onClick={() => setEditingId(null)}>Cancelar</Button>
                </Col>
              </Row>
            ) : (
              <>
                <span>{cat.nome}</span>
                <div>
                  <Button size="sm" variant="outline-dark" className="me-2" onClick={() => handleEdit(cat._id)}>Editar</Button>
                  <Button size="sm" variant="outline-danger" onClick={() => deleteCategory(cat._id)}>Excluir</Button>
                </div>
              </>
            )}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  )
}
