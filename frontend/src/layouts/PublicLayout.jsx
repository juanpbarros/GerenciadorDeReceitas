import { Outlet } from 'react-router-dom'

export default function PublicLayout() {
  return (
    <div className="auth-shell d-flex align-items-center justify-content-center px-3 py-5">
      <div className="w-100" style={{ maxWidth: 420 }}>
        <div className="text-center mb-4">
          <div
            className="mx-auto d-flex align-items-center justify-content-center rounded-4 text-white fw-semibold mb-2"
            style={{ width: 44, height: 44, background: '#0b1220' }}
          >
            R
          </div>
          <h1 className="h5 mb-1">Sistema de Receitas</h1>
          <p className="text-secondary mb-0">Acesse sua conta para continuar</p>
        </div>
        <Outlet />
      </div>
    </div>
  )
}

