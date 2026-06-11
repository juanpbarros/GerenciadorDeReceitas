export default function FavoriteButton({
  isFavorite,
  isLoading = false,
  recipeTitle = 'receita',
  onToggle,
}) {
  return (
    <button
      type="button"
      className={`btn btn-sm ${isFavorite ? 'btn-warning' : 'btn-outline-warning'}`}
      onClick={onToggle}
      disabled={isLoading}
      aria-pressed={isFavorite}
      aria-label={`${isFavorite ? 'Remover dos favoritos' : 'Favoritar'} ${recipeTitle}`}
    >
      <span aria-hidden="true">{isFavorite ? '★' : '☆'}</span>
      <span className="ms-1">{isLoading ? '...' : 'Favorito'}</span>
    </button>
  )
}
