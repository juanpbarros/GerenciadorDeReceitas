export default function DynamicTextList({ label, itemLabel, values, onChange, placeholder }) {
  const updateItem = (index, value) => {
    onChange(values.map((item, currentIndex) => (currentIndex === index ? value : item)))
  }

  const addItem = () => {
    onChange([...values, ''])
  }

  const removeItem = (index) => {
    if (values.length === 1) {
      onChange([''])
      return
    }

    onChange(values.filter((_, currentIndex) => currentIndex !== index))
  }

  return (
    <fieldset className="border rounded-3 p-3">
      <legend className="float-none w-auto px-2 h6 mb-0">{label}</legend>

      <div className="d-grid gap-2">
        {values.map((value, index) => (
          <div className="input-group" key={`${label}-${index}`}>
            <span className="input-group-text">{index + 1}</span>
            <label className="visually-hidden" htmlFor={`${label}-${index}`}>
              {itemLabel} {index + 1}
            </label>
            <input
              id={`${label}-${index}`}
              className="form-control"
              value={value}
              onChange={(event) => updateItem(index, event.target.value)}
              placeholder={placeholder}
            />
            <button
              className="btn btn-outline-danger"
              type="button"
              onClick={() => removeItem(index)}
              aria-label={`Remover item ${index + 1} de ${label.toLowerCase()}`}
            >
              Remover
            </button>
          </div>
        ))}
      </div>

      <button type="button" className="btn btn-outline-dark btn-sm mt-3" onClick={addItem}>
        + Adicionar {itemLabel.toLowerCase()}
      </button>
    </fieldset>
  )
}
