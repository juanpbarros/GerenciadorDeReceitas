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
    } catch (err) {
      setError('Não foi possível cadastrar. Tente novamente.')
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold">Cadastro</h2>
      <p className="mt-1 text-sm text-slate-600">Crie sua conta para salvar receitas.</p>

      {error && (
        <div role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <div>
          <label className="text-sm font-medium text-slate-700" htmlFor="name">Nome</label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-slate-900/10 focus:ring-4"
            placeholder="Seu nome"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-slate-900/10 focus:ring-4"
            placeholder="voce@email.com"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700" htmlFor="password">Senha</label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-slate-900/10 focus:ring-4"
            placeholder="Crie uma senha"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800"
        >
          Cadastrar
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-slate-600">
        Já tem conta?{' '}
        <Link className="font-medium text-slate-900 underline underline-offset-4" to="/login">
          Entrar
        </Link>
      </p>
    </div>
  )
}

