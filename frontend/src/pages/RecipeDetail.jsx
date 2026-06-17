import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import CommentForm from '../components/CommentForm'
import CommentList from '../components/CommentList'
import FavoriteButton from '../components/FavoriteButton'
import { useAuth } from '../hooks/useAuth'
import {
  createCommentRequest,
  deleteCommentRequest,
  listCommentsRequest,
  updateCommentRequest,
} from '../services/commentApi'
import {
  addFavoriteRequest,
  listFavoritesRequest,
  removeFavoriteRequest,
} from '../services/favoriteApi'
import { deleteRecipeRequest, getRecipeRequest } from '../services/recipeApi'
import { createShoppingListRequest } from '../services/shoppingListApi'

export default function RecipeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [recipe, setRecipe] = useState(null)
  const [comments, setComments] = useState([])
  const [commentsError, setCommentsError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingComments, setIsLoadingComments] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState('')
  const [favoriteError, setFavoriteError] = useState('')
  const [shareMessage, setShareMessage] = useState('')
  const [isCookingMode, setIsCookingMode] = useState(false)
  const [ownedIngredients, setOwnedIngredients] = useState([])
  const [shoppingListMessage, setShoppingListMessage] = useState('')
  const [isSavingMissingItems, setIsSavingMissingItems] = useState(false)

  const missingIngredients = recipe
    ? recipe.ingredients.filter((ingredient) => !ownedIngredients.includes(ingredient))
    : []
  const creatorId = recipe?.creator?._id || recipe?.creator?.id || recipe?.creator
  const isOwner = Boolean(creatorId && user?._id && creatorId.toString() === user._id.toString())

  useEffect(() => {
    let isMounted = true

    async function loadRecipe() {
      setIsLoading(true)
      setError('')

      try {
        const [{ recipe: apiRecipe }, { favorites }] = await Promise.all([
          getRecipeRequest(id),
          listFavoritesRequest(),
        ])

        if (isMounted) {
          setRecipe(apiRecipe)
          setIsFavorite(favorites.some((favorite) => favorite.recipeId === id))
        }
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

  const handleUpdateComment = async (commentId, { text, rating }) => {
    const { comment } = await updateCommentRequest(commentId, {
      texto: text,
      nota: rating,
    })

    setComments((currentComments) => currentComments.map((item) => (item.id === commentId ? comment : item)))
  }

  const handleDeleteComment = async (commentId) => {
    await deleteCommentRequest(commentId)
    setComments((currentComments) => currentComments.filter((comment) => comment.id !== commentId))
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

  const handleToggleFavorite = async () => {
    setIsFavoriteLoading(true)
    setFavoriteError('')

    try {
      if (isFavorite) {
        await removeFavoriteRequest(id)
        setIsFavorite(false)
      } else {
        await addFavoriteRequest(id)
        setIsFavorite(true)
      }
    } catch {
      setFavoriteError('Não foi possível atualizar o favorito.')
    } finally {
      setIsFavoriteLoading(false)
    }
  }

  const handleShare = async () => {
    const recipeUrl = window.location.href
    setShareMessage('')

    try {
      if (navigator.share) {
        await navigator.share({
          title: recipe.title,
          text: recipe.description,
          url: recipeUrl,
        })
        setShareMessage('Receita compartilhada com sucesso.')
        return
      }

      await navigator.clipboard.writeText(recipeUrl)
      setShareMessage('Link da receita copiado.')
    } catch {
      setShareMessage('Não foi possível compartilhar a receita.')
    }
  }

  const handleToggleCookingMode = () => {
    setIsCookingMode((currentValue) => !currentValue)
    setShoppingListMessage('')
  }

  const handleToggleIngredient = (ingredient) => {
    setOwnedIngredients((currentIngredients) => (
      currentIngredients.includes(ingredient)
        ? currentIngredients.filter((item) => item !== ingredient)
        : [...currentIngredients, ingredient]
    ))
  }

  const handleAddMissingToShoppingList = async () => {
    setIsSavingMissingItems(true)
    setShoppingListMessage('')

    try {
      await createShoppingListRequest({
        name: `Compras - ${recipe.title}`,
        items: missingIngredients.map((ingredient) => ({
          name: ingredient,
          purchased: false,
        })),
      })
      setShoppingListMessage('Ingredientes faltantes adicionados à lista de compras.')
    } catch {
      setShoppingListMessage('Não foi possível adicionar os ingredientes à lista de compras.')
    } finally {
      setIsSavingMissingItems(false)
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
          {!isOwner && recipe.creator?.nome && (
            <p className="text-secondary small mt-2 mb-0">Receita de {recipe.creator.nome}</p>
          )}
        </div>
        <div className="d-flex flex-wrap gap-2">
          <FavoriteButton
            isFavorite={isFavorite}
            isLoading={isFavoriteLoading}
            recipeTitle={recipe.title}
            onToggle={handleToggleFavorite}
          />
          <button type="button" className="btn btn-outline-dark" onClick={handleShare}>
            Compartilhar
          </button>
          <button type="button" className="btn btn-dark" onClick={handleToggleCookingMode}>
            {isCookingMode ? 'Fechar preparo' : 'Fazer Receita'}
          </button>
          {isOwner && (
            <>
              <Link to={`/receitas/${id}/editar`} className="btn btn-outline-dark">
                Editar
              </Link>
              <button type="button" className="btn btn-outline-danger" onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? 'Excluindo...' : 'Excluir'}
              </button>
            </>
          )}
        </div>
      </div>

      {shareMessage && (
        <div
          role="alert"
          className={`alert ${shareMessage.includes('Não foi possível') ? 'alert-warning' : 'alert-success'} py-2`}
        >
          {shareMessage}
        </div>
      )}

      {favoriteError && (
        <div role="alert" className="alert alert-danger py-2">
          {favoriteError}
        </div>
      )}

      {shoppingListMessage && (
        <div
          role="alert"
          className={`alert ${shoppingListMessage.includes('Não foi possível') ? 'alert-danger' : 'alert-success'} py-2`}
        >
          {shoppingListMessage}
        </div>
      )}

      {isCookingMode && (
        <section className="mb-4 p-3 border rounded-3 bg-light">
          <div className="d-flex flex-column flex-lg-row justify-content-between gap-3 mb-3">
            <div>
              <h3 className="h5 mb-1">Fazer Receita</h3>
              <p className="text-secondary mb-0">Marque os ingredientes que você já possui.</p>
            </div>
            <button
              type="button"
              className="btn btn-outline-dark align-self-start"
              onClick={handleAddMissingToShoppingList}
              disabled={missingIngredients.length === 0 || isSavingMissingItems}
            >
              {isSavingMissingItems ? 'Adicionando...' : 'Adicionar faltantes à lista de compras'}
            </button>
          </div>

          <div className="row g-3">
            <div className="col-12 col-lg-6">
              <h4 className="h6">Checklist de ingredientes</h4>
              <div className="list-group">
                {recipe.ingredients.map((ingredient) => (
                  <label className="list-group-item d-flex align-items-center gap-2" key={ingredient}>
                    <input
                      type="checkbox"
                      className="form-check-input m-0"
                      checked={ownedIngredients.includes(ingredient)}
                      onChange={() => handleToggleIngredient(ingredient)}
                    />
                    <span>{ingredient}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="col-12 col-lg-6">
              <h4 className="h6">Para comprar</h4>
              {missingIngredients.length > 0 ? (
                <ul className="list-group">
                  {missingIngredients.map((ingredient) => (
                    <li className="list-group-item" key={ingredient}>{ingredient}</li>
                  ))}
                </ul>
              ) : (
                <div className="alert alert-success mb-0">Você já possui todos os ingredientes.</div>
              )}
            </div>
          </div>
        </section>
      )}

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
        <CommentList
          comments={comments}
          currentUserId={user?._id}
          error={commentsError}
          isLoading={isLoadingComments}
          onDelete={handleDeleteComment}
          onUpdate={handleUpdateComment}
        />
      </section>

      <div className="mt-4">
        <CommentForm onSubmit={handleCreateComment} />
      </div>
    </div>
  )
}
