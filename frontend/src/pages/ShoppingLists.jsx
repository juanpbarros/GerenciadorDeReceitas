import { useEffect, useMemo, useState } from 'react'
import ShoppingListItemFields from '../components/ShoppingListItemFields'
import {
  createShoppingListRequest,
  deleteShoppingListRequest,
  listShoppingListsRequest,
  updateShoppingListRequest,
} from '../services/shoppingListApi'

const initialForm = {
  name: '',
  items: [{ name: '', purchased: false }],
}

export default function ShoppingLists() {
  const [form, setForm] = useState(initialForm)
  const [shoppingLists, setShoppingLists] = useState([])
  const [editingId, setEditingId] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [pendingActionId, setPendingActionId] = useState('')

  const cleanPreview = useMemo(() => ({
    name: form.name.trim(),
    items: form.items
      .map((item) => ({
        ...(item.id ? { id: item.id } : {}),
        name: item.name.trim(),
        purchased: item.purchased,
      }))
      .filter((item) => item.name),
  }), [form])

  useEffect(() => {
    let isMounted = true

    async function loadShoppingLists() {
      setIsLoading(true)
      setError('')

      try {
        const { shoppingLists: loadedShoppingLists } = await listShoppingListsRequest()
        if (isMounted) setShoppingLists(loadedShoppingLists)
      } catch {
        if (isMounted) setError('Não foi possível carregar as listas de compras.')
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadShoppingLists()

    return () => {
      isMounted = false
    }
  }, [])

  const resetForm = () => {
    setForm(initialForm)
    setEditingId('')
  }

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
    setMessage('')
    setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage('')
    setError('')

    if (!cleanPreview.name || cleanPreview.items.length === 0) {
      setMessage('Preencha o nome da lista e pelo menos um item.')
      return
    }

    setIsSubmitting(true)

    try {
      if (editingId) {
        const { shoppingList } = await updateShoppingListRequest(editingId, cleanPreview)
        setShoppingLists((currentLists) => currentLists.map((list) => (
          list.id === editingId ? shoppingList : list
        )))
        setMessage('Lista de compras atualizada com sucesso.')
      } else {
        const { shoppingList } = await createShoppingListRequest(cleanPreview)
        setShoppingLists((currentLists) => [shoppingList, ...currentLists])
        setMessage('Lista de compras salva com sucesso.')
      }

      resetForm()
    } catch {
      setError('Não foi possível salvar a lista de compras.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (shoppingList) => {
    setEditingId(shoppingList.id)
    setForm({
      name: shoppingList.name,
      items: shoppingList.items.length > 0 ? shoppingList.items : [{ name: '', purchased: false }],
    })
    setMessage('')
    setError('')
  }

  const handleDelete = async (shoppingListId) => {
    setPendingActionId(shoppingListId)
    setMessage('')
    setError('')

    try {
      await deleteShoppingListRequest(shoppingListId)
      setShoppingLists((currentLists) => currentLists.filter((list) => list.id !== shoppingListId))
      if (editingId === shoppingListId) resetForm()
      setMessage('Lista de compras excluída com sucesso.')
    } catch {
      setError('Não foi possível excluir a lista de compras.')
    } finally {
      setPendingActionId('')
    }
  }

  const handleToggleItem = async (shoppingList, itemIndex) => {
    const updatedList = {
      ...shoppingList,
      items: shoppingList.items.map((item, index) => (
        index === itemIndex ? { ...item, purchased: !item.purchased } : item
      )),
    }

    setPendingActionId(`${shoppingList.id}-${itemIndex}`)
    setMessage('')
    setError('')

    try {
      const { shoppingList: savedShoppingList } = await updateShoppingListRequest(shoppingList.id, updatedList)
      setShoppingLists((currentLists) => currentLists.map((list) => (
        list.id === savedShoppingList.id ? savedShoppingList : list
      )))
    } catch {
      setError('Não foi possível atualizar o item da lista.')
    } finally {
      setPendingActionId('')
    }
  }

  return (
    <div>
      <div className="d-flex flex-column flex-lg-row justify-content-between gap-3 mb-4">
        <div>
          <h2 className="h4 mb-1">Lista de compras</h2>
          <p className="text-secondary mb-0">
            Monte listas com ingredientes faltantes e marque o que já foi comprado.
          </p>
        </div>
      </div>

      {message && (
        <div role="alert" className={`alert ${message.includes('sucesso') ? 'alert-success' : 'alert-warning'}`}>
          {message}
        </div>
      )}

      {error && (
        <div role="alert" className="alert alert-danger">
          {error}
        </div>
      )}

      <form className="row g-3" onSubmit={handleSubmit}>
        <div className="col-12 col-lg-8">
          <label className="form-label" htmlFor="shopping-list-name">Nome da lista</label>
          <input
            id="shopping-list-name"
            className="form-control"
            value={form.name}
            onChange={(event) => updateField('name', event.target.value)}
            placeholder="Ex: Compras do bolo"
          />
        </div>

        <div className="col-12">
          <ShoppingListItemFields
            items={form.items}
            onChange={(items) => updateField('items', items)}
          />
        </div>

        <div className="col-12 d-flex flex-wrap gap-2 justify-content-end">
          {editingId && (
            <button type="button" className="btn btn-outline-secondary" onClick={resetForm}>
              Cancelar edição
            </button>
          )}
          <button type="submit" className="btn btn-dark" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : editingId ? 'Atualizar lista' : 'Salvar lista'}
          </button>
        </div>
      </form>

      <section className="mt-5">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h3 className="h5 mb-0">Minhas listas</h3>
        </div>

        {isLoading && (
          <div className="border rounded-3 p-3 text-center text-secondary">
            <div className="spinner-border spinner-border-sm me-2" role="status" aria-label="Carregando listas de compras" />
            Carregando listas de compras...
          </div>
        )}

        {!isLoading && shoppingLists.length === 0 && (
          <div className="border rounded-3 p-3 text-secondary">
            Nenhuma lista de compras cadastrada.
          </div>
        )}

        {!isLoading && shoppingLists.length > 0 && (
          <div className="d-grid gap-3">
            {shoppingLists.map((shoppingList) => (
              <article className="border rounded-3 p-3 bg-white" key={shoppingList.id}>
                <div className="d-flex flex-column flex-md-row justify-content-between gap-3 mb-3">
                  <div>
                    <h4 className="h6 mb-1">{shoppingList.name}</h4>
                    <span className="text-secondary small">
                      {shoppingList.items.filter((item) => item.purchased).length} de {shoppingList.items.length} itens comprados
                    </span>
                  </div>

                  <div className="d-flex flex-wrap gap-2">
                    <button type="button" className="btn btn-outline-dark btn-sm" onClick={() => handleEdit(shoppingList)}>
                      Editar
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      disabled={pendingActionId === shoppingList.id}
                      onClick={() => handleDelete(shoppingList.id)}
                    >
                      Excluir
                    </button>
                  </div>
                </div>

                <div className="list-group">
                  {shoppingList.items.map((item, index) => (
                    <label className="list-group-item d-flex align-items-center gap-2" key={item.id || `${shoppingList.id}-${index}`}>
                      <input
                        className="form-check-input m-0"
                        type="checkbox"
                        checked={item.purchased}
                        disabled={pendingActionId === `${shoppingList.id}-${index}`}
                        onChange={() => handleToggleItem(shoppingList, index)}
                        aria-label={`Marcar ${item.name} como comprado`}
                      />
                      <span className={item.purchased ? 'text-decoration-line-through text-secondary' : ''}>
                        {item.name}
                      </span>
                    </label>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
