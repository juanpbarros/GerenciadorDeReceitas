import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import DynamicTextList from '../components/DynamicTextList'
import { RECIPE_CATEGORIES } from '../data/mockRecipes'
import { createRecipeRequest, getRecipeRequest, updateRecipeRequest } from '../services/recipeApi'

const initialForm = {
  title: '',
  description: '',
  prepTimeMinutes: '',
  category: RECIPE_CATEGORIES[0],
  imageUrl: '',
  ingredients: [''],
  preparationSteps: [''],
}

export default function RecipeForm({ mode }) {
  const isEdit = mode === 'edit'
  const navigate = useNavigate()
  const { id } = useParams()
  const [form, setForm] = useState(initialForm)
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(isEdit)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const cleanPreview = useMemo(() => ({
    title: form.title.trim(),
    description: form.description.trim(),
    prepTimeMinutes: Number(form.prepTimeMinutes),
    category: form.category,
    imageUrl: form.imageUrl.trim() || null,
    ingredients: form.ingredients.map((item) => item.trim()).filter(Boolean),
    preparationSteps: form.preparationSteps.map((item) => item.trim()).filter(Boolean),
  }), [form])

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
    setMessage('')
  }

  useEffect(() => {
    if (!isEdit) return undefined

    let isMounted = true

    async function loadRecipe() {
      setIsLoading(true)
      setMessage('')

      try {
        const { recipe } = await getRecipeRequest(id)
        if (!isMounted) return

        setForm({
          title: recipe.title || '',
          description: recipe.description || '',
          prepTimeMinutes: recipe.prepTimeMinutes ? String(recipe.prepTimeMinutes) : '',
          category: recipe.category || RECIPE_CATEGORIES[0],
          imageUrl: recipe.imageUrl || '',
          ingredients: recipe.ingredients.length > 0 ? recipe.ingredients : [''],
          preparationSteps: recipe.preparationSteps.length > 0 ? recipe.preparationSteps : [''],
        })
      } catch {
        if (isMounted) setMessage('Não foi possível carregar a receita.')
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadRecipe()

    return () => {
      isMounted = false
    }
  }, [id, isEdit])

  const toApiPayload = () => ({
    titulo: cleanPreview.title,
    descricao: cleanPreview.description,
    ingredientes: cleanPreview.ingredients,
    modoPreparo: cleanPreview.preparationSteps,
    tempoPreparo: cleanPreview.prepTimeMinutes,
    categoria: cleanPreview.category,
    imagemUrl: cleanPreview.imageUrl || '',
  })

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!cleanPreview.title || !cleanPreview.description || !cleanPreview.prepTimeMinutes || cleanPreview.ingredients.length === 0 || cleanPreview.preparationSteps.length === 0) {
      setMessage('Preencha título, descrição, tempo de preparo, pelo menos um ingrediente e pelo menos uma etapa de preparo.')
      return
    }

    setIsSubmitting(true)
    setMessage('')

    try {
      if (isEdit) await updateRecipeRequest(id, toApiPayload())
      else await createRecipeRequest(toApiPayload())
      navigate('/receitas')
    } catch {
      setMessage('Não foi possível salvar a receita. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <div className="d-flex flex-column flex-lg-row justify-content-between gap-3 mb-4">
        <div>
          <h2 className="h4 mb-1">{isEdit ? 'Editar receita' : 'Nova receita'}</h2>
          <p className="text-secondary mb-0">
            Cadastre ingredientes e modo de preparo em campos dinâmicos.
          </p>
        </div>
      </div>

      {isLoading && (
        <div className="empty-state border rounded-3 bg-light p-4 text-center">
          <div className="spinner-border text-dark" role="status" aria-label="Carregando receita" />
          <p className="text-secondary mt-3 mb-0">Carregando receita...</p>
        </div>
      )}

      {message && (
        <div role="alert" className="alert alert-warning">
          {message}
        </div>
      )}

      {!isLoading && (
      <form className="row g-3" onSubmit={handleSubmit}>
        <div className="col-12 col-lg-8">
          <label className="form-label" htmlFor="title">Título</label>
          <input
            id="title"
            value={form.title}
            onChange={(event) => updateField('title', event.target.value)}
            className="form-control"
            placeholder="Ex: Bolo de chocolate"
          />
        </div>

        <div className="col-12 col-lg-4">
          <label className="form-label" htmlFor="category">Categoria</label>
          <select
            id="category"
            value={form.category}
            onChange={(event) => updateField('category', event.target.value)}
            className="form-select"
          >
            {RECIPE_CATEGORIES.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="col-12">
          <label className="form-label" htmlFor="description">Descrição</label>
          <textarea
            id="description"
            value={form.description}
            onChange={(event) => updateField('description', event.target.value)}
            className="form-control"
            rows="3"
            placeholder="Descreva brevemente a receita"
          />
        </div>

        <div className="col-12 col-md-4">
          <label className="form-label" htmlFor="prepTimeMinutes">Tempo de preparo (min)</label>
          <input
            id="prepTimeMinutes"
            type="number"
            min="1"
            value={form.prepTimeMinutes}
            onChange={(event) => updateField('prepTimeMinutes', event.target.value)}
            className="form-control"
            placeholder="45"
          />
        </div>

        <div className="col-12 col-md-8">
          <label className="form-label" htmlFor="imageUrl">Imagem (opcional)</label>
          <input
            id="imageUrl"
            value={form.imageUrl}
            onChange={(event) => updateField('imageUrl', event.target.value)}
            className="form-control"
            placeholder="https://exemplo.com/imagem.jpg"
          />
        </div>

        <div className="col-12">
          <DynamicTextList
            label="Ingredientes"
            itemLabel="Ingrediente"
            values={form.ingredients}
            onChange={(values) => updateField('ingredients', values)}
            placeholder="Ex: 2 ovos"
          />
        </div>

        <div className="col-12">
          <DynamicTextList
            label="Modo de preparo"
            itemLabel="Etapa"
            values={form.preparationSteps}
            onChange={(values) => updateField('preparationSteps', values)}
            placeholder="Ex: Misture os ingredientes"
          />
        </div>

        <div className="col-12 d-flex justify-content-end gap-2">
          <button type="submit" className="btn btn-dark" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : isEdit ? 'Salvar alterações' : 'Salvar receita'}
          </button>
        </div>
      </form>
      )}
    </div>
  )
}
