import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await register(name, email, password)
      navigate('/')
    } catch {
      setError('Não foi possível cadastrar. Tente novamente.')
    }
  }

  return (
    <div className="auth-card bg-white p-4">
      <h2 className="h5 mb-1">Cadastro</h2>
      <p className="text-secondary mb-3">Crie sua conta para salvar receitas.</p>

      {error && (
        <div role="alert" className="alert alert-danger py-2">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="d-grid gap-3">
        <div>
          <label className="form-label" htmlFor="name">Nome</label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-control"
            placeholder="Seu nome"
          />
        </div>

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
            placeholder="Crie uma senha"
          />
        </div>

        <button type="submit" className="btn btn-dark">
          Cadastrar
        </button>
      </form>

      <div className="text-center mt-3 small text-secondary">
        Já tem conta? <Link to="/login" className="link-dark fw-semibold">Entrar</Link>
      </div>
    </div>
  )
}

