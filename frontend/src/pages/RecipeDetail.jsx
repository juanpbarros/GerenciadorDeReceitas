import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import CommentForm from '../components/CommentForm'
import CommentList from '../components/CommentList'
import { createCommentRequest, listCommentsRequest } from '../services/commentApi'
import { deleteRecipeRequest, getRecipeRequest } from '../services/recipeApi'

export default function RecipeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [recipe, setRecipe] = useState(null)
  const [comments, setComments] = useState([])
  const [commentsError, setCommentsError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingComments, setIsLoadingComments] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadRecipe() {
      setIsLoading(true)
      setError('')

      try {
        const { recipe: apiRecipe } = await getRecipeRequest(id)
        if (isMounted) setRecipe(apiRecipe)
      } catch {
        if (isMounted) setError('Não foi possível carregar a receita.')
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadRecipe()

    return () => {
      isMounted = false
    }
  }, [id])

  useEffect(() => {
    if (!recipe) return undefined

    let isMounted = true

    async function loadComments() {
      setIsLoadingComments(true)
      setCommentsError('')

      try {
        const { comments: loadedComments } = await listCommentsRequest(id)
        if (isMounted) setComments(loadedComments)
      } catch {
        if (isMounted) setCommentsError('Não foi possível carregar os comentários.')
      } finally {
        if (isMounted) setIsLoadingComments(false)
      }
    }

    loadComments()

    return () => {
      isMounted = false
    }
  }, [id, recipe])

  const handleCreateComment = async ({ text, rating }) => {
    const { comment } = await createCommentRequest({
      receita: id,
      texto: text,
      nota: rating,
    })

    setComments((currentComments) => [comment, ...currentComments])
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    setError('')

    try {
      await deleteRecipeRequest(id)
      navigate('/receitas')
    } catch {
      setError('Não foi possível excluir a receita.')
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="empty-state border rounded-3 bg-light p-4 text-center">
        <div className="spinner-border text-dark" role="status" aria-label="Carregando receita" />
        <p className="text-secondary mt-3 mb-0">Carregando receita...</p>
      </div>
    )
  }

  if (error || !recipe) {
    return (
      <div className="text-center py-4">
        <h2 className="h4 mb-2">Receita não encontrada</h2>
        <p role="alert" className="text-secondary mb-4">{error || 'A receita selecionada não foi encontrada.'}</p>
        <Link to="/receitas" className="btn btn-dark">Voltar para receitas</Link>
      </div>
    )
  }

  return (
    <div>
      <div className="d-flex flex-column flex-md-row align-items-md-start justify-content-between gap-3 mb-4">
        <div>
          <span className="badge text-bg-light border mb-2">{recipe.category}</span>
          <h2 className="h4 mb-1">{recipe.title}</h2>
          <p className="text-secondary mb-0">{recipe.description}</p>
          {recipe.origin === 'imported' && recipe.sourceName && (
            <p className="text-secondary small mt-2 mb-0">Receita de {recipe.sourceName}</p>
          )}
        </div>
        <div className="d-flex gap-2">
          <Link to={`/receitas/${id}/editar`} className="btn btn-outline-dark">
            Editar
          </Link>
          <button type="button" className="btn btn-outline-danger" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? 'Excluindo...' : 'Excluir'}
          </button>
        </div>
      </div>

      <div className="row g-4">
        <section className="col-12 col-lg-5">
          <h3 className="h6">Ingredientes</h3>
          <ul className="list-group list-group-flush border rounded-3">
            {recipe.ingredients.map((ingredient) => (
              <li className="list-group-item" key={ingredient}>{ingredient}</li>
            ))}
          </ul>
        </section>

        <section className="col-12 col-lg-7">
          <h3 className="h6">Modo de preparo</h3>
          <ol className="list-group list-group-numbered border rounded-3">
            {recipe.preparationSteps.map((step) => (
              <li className="list-group-item" key={step}>{step}</li>
            ))}
          </ol>
        </section>
      </div>

      <div className="mt-4 p-3 bg-light border rounded-3 d-flex flex-wrap gap-3 text-secondary small">
        <span>Tempo: {recipe.prepTimeMinutes} min</span>
        <span>Nota: {recipe.rating}</span>
      </div>

      <section className="mt-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h3 className="h5 mb-0">Comentários</h3>
        </div>
        <CommentList comments={comments} error={commentsError} isLoading={isLoadingComments} />
      </section>

      <div className="mt-4">
        <CommentForm onSubmit={handleCreateComment} />
      </div>
    </div>
  )
}
