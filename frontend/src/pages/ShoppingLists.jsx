import { useMemo, useState } from 'react'
import ShoppingListItemFields from '../components/ShoppingListItemFields'

const initialForm = {
  name: '',
  items: [{ name: '', purchased: false }],
}

export default function ShoppingLists() {
  const [form, setForm] = useState(initialForm)
  const [message, setMessage] = useState('')

  const cleanPreview = useMemo(() => ({
    name: form.name.trim(),
    items: form.items
      .map((item) => ({ name: item.name.trim(), purchased: item.purchased }))
      .filter((item) => item.name),
  }), [form])

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
    setMessage('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!cleanPreview.name || cleanPreview.items.length === 0) {
      setMessage('Preencha o nome da lista e pelo menos um item.')
      return
    }

    setMessage('Lista de compras pronta para integração com o backend.')
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
        <div role="alert" className={`alert ${message.includes('pronta') ? 'alert-success' : 'alert-warning'}`}>
          {message}
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

        <div className="col-12 d-flex justify-content-end">
          <button type="submit" className="btn btn-dark">
            Salvar lista
          </button>
        </div>
      </form>
    </div>
  )
}

