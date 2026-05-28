import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Topbar() {
  const { user, logout } = useAuth()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const showSearch = useMemo(() => {
    if (!user) return false
    return pathname === '/' || pathname.startsWith('/receitas') || pathname.startsWith('/favoritos')
  }, [pathname, user])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center gap-4 px-4">
        <Link to={user ? '/' : '/login'} className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white">R</span>
          <span className="hidden sm:inline">Sistema de Receitas</span>
        </Link>

        {showSearch && (
          <div className="hidden w-full max-w-md md:block">
            <label className="sr-only" htmlFor="topbar-search">Buscar receitas</label>
            <input
              id="topbar-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar receitas..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none ring-slate-900/10 focus:bg-white focus:ring-4"
            />
          </div>
        )}

        <div className="flex flex-1 items-center justify-end gap-3">
          {user ? (
            <>
              <Link
                to="/receitas/nova"
                className="hidden rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800 md:inline"
              >
                + Nova receita
              </Link>
              <Link to="/perfil" className="text-sm font-medium text-slate-800 hover:text-slate-900">
                {user.nome}
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
              >
                Sair
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="rounded-xl px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100">
                Entrar
              </Link>
              <Link to="/register" className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800">
                Cadastrar
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

