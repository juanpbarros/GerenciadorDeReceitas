import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="d-flex min-vh-100 align-items-center justify-content-center bg-light">
        <div className="text-center">
          <div className="spinner-border text-dark" role="status" aria-label="Carregando sessão" />
          <p className="mt-3 mb-0 text-secondary">Carregando sessão...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}
