import { useAuth } from '../contexts/AuthContext'

export default function Profile() {
  const { user } = useAuth()

  return (
    <div>
      <h2 className="h4 mb-3">Perfil</h2>
      <div className="row g-3">
        <div className="col-md-6">
          <div className="p-3 bg-light border rounded-4">
            <div className="text-secondary small">Nome</div>
            <div className="fw-semibold">{user?.nome}</div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="p-3 bg-light border rounded-4">
            <div className="text-secondary small">Email</div>
            <div className="fw-semibold">{user?.email}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

