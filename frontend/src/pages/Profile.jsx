import { useAuth } from '../contexts/AuthContext'

export default function Profile() {
  const { user } = useAuth()

  return (
    <div>
      <h2 className="text-lg font-semibold">Perfil</h2>
      <div className="mt-4 grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm">
        <div>
          <div className="text-slate-500">Nome</div>
          <div className="font-medium text-slate-900">{user?.nome}</div>
        </div>
        <div>
          <div className="text-slate-500">Email</div>
          <div className="font-medium text-slate-900">{user?.email}</div>
        </div>
      </div>
    </div>
  )
}

