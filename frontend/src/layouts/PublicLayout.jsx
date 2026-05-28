import { Outlet } from 'react-router-dom'

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
              R
            </div>
            <h1 className="text-xl font-semibold tracking-tight">Sistema de Receitas</h1>
            <p className="mt-1 text-sm text-slate-600">Acesse sua conta para continuar</p>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

