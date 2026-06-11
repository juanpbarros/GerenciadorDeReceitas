import { useEffect, useMemo, useState } from 'react'
import HistoryForm, { initialForm } from '../components/HistoryForm'
import {
  createRecipeHistoryRequest,
  deleteRecipeHistoryRequest,
  listRecipeHistoryRequest,
  updateRecipeHistoryRequest,
} from '../services/recipeHistoryApi'
import { listRecipesRequest } from '../services/recipeApi'

function formatDate(date) {
  if (!date) return 'Data não informada'

  return new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' }).format(new Date(date))
}

function toDateInputValue(date) {
  if (!date) return ''

  return new Date(date).toISOString().slice(0, 10)
}

export default function History() {
  const [form, setForm] = useState(initialForm)
  const [history, setHistory] = useState([])
  const [recipes, setRecipes] = useState([])
  const [editingId, setEditingId] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [pendingActionId, setPendingActionId] = useState('')

  const cleanPreview = useMemo(() => ({
    recipeId: form.recipeId,
    date: form.date,
    observation: form.observation.trim(),
    personalRating: form.personalRating ? Number(form.personalRating) : null,
  }), [form])

  useEffect(() => {
    let isMounted = true

    async function loadPageData() {
      setIsLoading(true)
      setError('')

      try {
        const [{ history: loadedHistory }, { recipes: loadedRecipes }] = await Promise.all([
          listRecipeHistoryRequest(),
          listRecipesRequest(),
        ])

        if (isMounted) {
          setHistory(loadedHistory)
          setRecipes(loadedRecipes)
        }
      } catch {
        if (isMounted) setError('Não foi possível carregar o histórico.')
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadPageData()

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

    if (!cleanPreview.recipeId || !cleanPreview.date) {
      setMessage('Selecione uma receita e informe a data em que ela foi feita.')
      return
    }

    setIsSubmitting(true)

    try {
      if (editingId) {
        const { historyRecord } = await updateRecipeHistoryRequest(editingId, cleanPreview)
        setHistory((currentHistory) => currentHistory.map((item) => (
          item.id === editingId ? historyRecord : item
        )))
        setMessage('Registro de histórico atualizado com sucesso.')
      } else {
        const { historyRecord } = await createRecipeHistoryRequest(cleanPreview)
        setHistory((currentHistory) => [historyRecord, ...currentHistory])
        setMessage('Registro de histórico salvo com sucesso.')
      }

      resetForm()
    } catch {
      setError('Não foi possível salvar o histórico.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (historyRecord) => {
    setEditingId(historyRecord.id)
    setForm({
      recipeId: historyRecord.recipeId,
      date: toDateInputValue(historyRecord.date),
      observation: historyRecord.observation,
      personalRating: historyRecord.personalRating ? String(historyRecord.personalRating) : '',
    })
    setMessage('')
    setError('')
  }

  const handleDelete = async (historyId) => {
    setPendingActionId(historyId)
    setMessage('')
    setError('')

    try {
      await deleteRecipeHistoryRequest(historyId)
      setHistory((currentHistory) => currentHistory.filter((item) => item.id !== historyId))
      if (editingId === historyId) resetForm()
      setMessage('Registro de histórico excluído com sucesso.')
    } catch {
      setError('Não foi possível excluir o histórico.')
    } finally {
      setPendingActionId('')
    }
  }

  return (
    <div>
      <div className="d-flex flex-column flex-lg-row justify-content-between gap-3 mb-4">
        <div>
          <h2 className="h4 mb-1">Histórico</h2>
          <p className="text-secondary mb-0">
            Registre receitas já feitas, com data, observação e nota pessoal.
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

      <HistoryForm
        form={form}
        isSubmitting={isSubmitting}
        onCancel={editingId ? resetForm : null}
        onChange={updateField}
        onSubmit={handleSubmit}
        recipes={recipes}
        submitLabel={editingId ? 'Atualizar histórico' : 'Salvar histórico'}
      />

      <section className="mt-5">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h3 className="h5 mb-0">Receitas feitas</h3>
        </div>

        {isLoading && (
          <div className="border rounded-3 p-3 text-center text-secondary">
            <div className="spinner-border spinner-border-sm me-2" role="status" aria-label="Carregando histórico" />
            Carregando histórico...
          </div>
        )}

        {!isLoading && history.length === 0 && (
          <div className="border rounded-3 p-3 text-secondary">
            Nenhum registro de histórico cadastrado.
          </div>
        )}

        {!isLoading && history.length > 0 && (
          <div className="d-grid gap-3">
            {history.map((historyRecord) => (
              <article className="border rounded-3 p-3 bg-white" key={historyRecord.id}>
                <div className="d-flex flex-column flex-md-row justify-content-between gap-3">
                  <div>
                    <h4 className="h6 mb-1">{historyRecord.recipeTitle}</h4>
                    <div className="text-secondary small">
                      {formatDate(historyRecord.date)}
                      {historyRecord.personalRating ? ` · Nota ${historyRecord.personalRating}/5` : ''}
                    </div>
                    {historyRecord.observation && (
                      <p className="mb-0 mt-2">{historyRecord.observation}</p>
                    )}
                  </div>

                  <div className="d-flex flex-wrap gap-2 align-self-start">
                    <button type="button" className="btn btn-outline-dark btn-sm" onClick={() => handleEdit(historyRecord)}>
                      Editar
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      disabled={pendingActionId === historyRecord.id}
                      onClick={() => handleDelete(historyRecord.id)}
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
