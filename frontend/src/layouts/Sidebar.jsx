import { NavLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Sidebar() {
  const { user } = useAuth()

  return (
    <nav className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
      <ul className="space-y-1 text-sm">
        <SidebarLink to="/" end label="Início" />
        <SidebarLink to="/receitas" label="Receitas" />
        {user && <SidebarLink to="/receitas/nova" label="Nova receita" />}
        {user && <SidebarLink to="/favoritos" label="Favoritos" />}
        {user && <SidebarLink to="/lista-compras" label="Lista de compras" />}
        {user && <SidebarLink to="/historico" label="Histórico" />}
        {user && <SidebarLink to="/perfil" label="Perfil" />}
      </ul>

      {!user && (
        <div className="mt-3 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
          Faça login para acessar recursos como favoritos, lista de compras e histórico.
        </div>
      )}
    </nav>
  )
}

function SidebarLink({ to, end, label }) {
  return (
    <li>
      <NavLink
        to={to}
        end={end}
        className={({ isActive }) =>
          [
            'block rounded-xl px-3 py-2 font-medium',
            isActive ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900',
          ].join(' ')
        }
      >
        {label}
      </NavLink>
    </li>
  )
}

