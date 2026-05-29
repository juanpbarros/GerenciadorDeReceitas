import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="text-center">
      <h2 className="h4 mb-1">Página não encontrada</h2>
      <p className="text-secondary mb-4">O endereço acessado não existe.</p>
      <Link to="/" className="btn btn-dark">
        Voltar ao início
      </Link>
    </div>
  )
}

