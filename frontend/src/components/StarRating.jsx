export default function StarRating({ rating, onRate, readonly = true }) {
  const stars = [1, 2, 3, 4, 5]

  return (
    <div className="d-inline-flex align-items-center gap-1" aria-label={`Nota ${rating} de 5`}>
      {stars.map((star) => (
        <span
          key={star}
          role={readonly ? undefined : 'button'}
          onClick={readonly ? undefined : () => onRate?.(star)}
          style={{
            cursor: readonly ? 'default' : 'pointer',
            color: star <= Math.round(rating) ? '#ffc107' : '#e4e5e9',
          }}
        >
          ★
        </span>
      ))}
      {rating > 0 && <small className="text-muted ms-1">({rating})</small>}
    </div>
  )
}

