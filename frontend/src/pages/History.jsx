import HistoryForm from '../components/HistoryForm'

export default function History() {
  return (
    <div>
      <div className="d-flex flex-column flex-lg-row justify-content-between gap-3 mb-4">
        <div>
          <h2 className="h4 mb-1">Histórico</h2>
          <p className="text-secondary mb-0">
            Registre receitas já feitas, com data, observação e nota pessoal.
          </p>
        </div>
      </div>

      <HistoryForm />
    </div>
  )
}
