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
    <nav className="navbar navbar-expand-lg bg-white border-bottom fixed-top app-topbar">
      <div className="container-fluid">
        <Link to={user ? '/' : '/login'} className="navbar-brand d-flex align-items-center gap-2 fw-semibold">
          <span className="d-inline-flex align-items-center justify-content-center rounded-3 text-white"
            style={{ width: 36, height: 36, background: '#0b1220' }}
          >
            R
          </span>
          <span className="d-none d-sm-inline">Sistema de Receitas</span>
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#topbarNav" aria-controls="topbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="topbarNav">
          <div className="ms-lg-3 me-auto" />

          {showSearch && (
            <form className="d-none d-lg-block me-3" role="search" style={{ width: 420, maxWidth: '42vw' }}>
              <label className="visually-hidden" htmlFor="topbar-search">Buscar receitas</label>
              <input
                id="topbar-search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="form-control"
                placeholder="Buscar receitas..."
              />
            </form>
          )}

          <ul className="navbar-nav align-items-lg-center gap-2">
            {user ? (
              <>
                <li className="nav-item">
                  <Link to="/receitas/nova" className="btn btn-dark btn-sm">
                    + Nova receita
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/perfil" className="nav-link fw-medium">
                    {user.nome}
                  </Link>
                </li>
                <li className="nav-item">
                  <button type="button" className="btn btn-outline-dark btn-sm" onClick={handleLogout}>
                    Sair
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/login" className="nav-link">
                    Entrar
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/register" className="btn btn-dark btn-sm">
                    Cadastrar
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}

