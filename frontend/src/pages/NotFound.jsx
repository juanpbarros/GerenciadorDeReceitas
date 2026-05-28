import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md text-center">
      <h2 className="text-lg font-semibold">Página não encontrada</h2>
      <p className="mt-1 text-sm text-slate-600">O endereço acessado não existe.</p>
      <Link
        to="/"
        className="mt-6 inline-flex rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800"
      >
        Voltar ao início
      </Link>
    </div>
  )
}

