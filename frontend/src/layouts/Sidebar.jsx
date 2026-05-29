import { NavLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Sidebar() {
  const { user } = useAuth()

  return (
    <aside className="app-sidebar px-3 py-3">
      <div className="d-flex align-items-center justify-content-between mb-2">
        <div className="text-uppercase text-secondary small fw-semibold">Navegação</div>
      </div>

      <nav className="nav nav-pills flex-column gap-1">
        <SideLink to="/" end label="Início" />
        <SideLink to="/receitas" label="Receitas" />
        {user && <SideLink to="/receitas/nova" label="Nova receita" />}
        {user && <SideLink to="/favoritos" label="Favoritos" />}
        {user && <SideLink to="/lista-compras" label="Lista de compras" />}
        {user && <SideLink to="/historico" label="Histórico" />}
        {user && <SideLink to="/perfil" label="Perfil" />}
      </nav>

      {!user && (
        <div className="alert alert-light border mt-3 mb-0 small">
          Faça login para acessar favoritos, lista de compras e histórico.
        </div>
      )}
    </aside>
  )
}

function SideLink({ to, end, label }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        ['nav-link sidebar-link', isActive ? 'active' : 'text-dark'].join(' ')
      }
    >
      {label}
    </NavLink>
  )
}

