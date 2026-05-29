import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await login(email, password)
      navigate('/')
    } catch {
      setError('Não foi possível entrar. Verifique seus dados.')
    }
  }

  return (
    <div className="auth-card bg-white p-4">
      <h2 className="h5 mb-1">Entrar</h2>
      <p className="text-secondary mb-3">Use seu email e senha.</p>

      {error && (
        <div role="alert" className="alert alert-danger py-2">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="d-grid gap-3">
        <div>
          <label className="form-label" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
            placeholder="voce@email.com"
          />
        </div>

        <div>
          <label className="form-label" htmlFor="password">Senha</label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control"
            placeholder="••••••••"
          />
        </div>

        <button type="submit" className="btn btn-dark">
          Entrar
        </button>
      </form>

      <div className="text-center mt-3 small text-secondary">
        Não tem conta? <Link to="/register" className="link-dark fw-semibold">Cadastre-se</Link>
      </div>
    </div>
  )
}

