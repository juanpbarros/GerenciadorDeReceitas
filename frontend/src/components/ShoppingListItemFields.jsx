export default function ShoppingListItemFields({ items, onChange }) {
  const updateItem = (index, changes) => {
    onChange(items.map((item, currentIndex) => (
      currentIndex === index ? { ...item, ...changes } : item
    )))
  }

  const addItem = () => {
    onChange([...items, { name: '', purchased: false }])
  }

  const removeItem = (index) => {
    if (items.length === 1) {
      onChange([{ name: '', purchased: false }])
      return
    }

    onChange(items.filter((_, currentIndex) => currentIndex !== index))
  }

  return (
    <fieldset className="border rounded-3 p-3">
      <legend className="float-none w-auto px-2 h6 mb-0">Itens da lista</legend>

      <div className="d-grid gap-2">
        {items.map((item, index) => (
          <div className="input-group" key={`shopping-item-${index}`}>
            <span className="input-group-text">{index + 1}</span>
            <label className="visually-hidden" htmlFor={`shopping-item-${index}`}>
              Item de compra {index + 1}
            </label>
            <input
              id={`shopping-item-${index}`}
              className="form-control"
              value={item.name}
              onChange={(event) => updateItem(index, { name: event.target.value })}
              placeholder="Ex: farinha"
            />
            <span className="input-group-text">
              <input
                className="form-check-input mt-0 me-2"
                type="checkbox"
                checked={item.purchased}
                onChange={(event) => updateItem(index, { purchased: event.target.checked })}
                aria-label={`Marcar item ${index + 1} como comprado`}
              />
              Comprado
            </span>
            <button
              className="btn btn-outline-danger"
              type="button"
              onClick={() => removeItem(index)}
              aria-label={`Remover linha ${index + 1} da lista de compras`}
            >
              Remover
            </button>
          </div>
        ))}
      </div>

      <button type="button" className="btn btn-outline-dark btn-sm mt-3" onClick={addItem}>
        + Adicionar item
      </button>
    </fieldset>
  )
}
