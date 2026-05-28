import { Spinner } from 'react-bootstrap'

export default function LoadingSpinner() {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
      <Spinner animation="border" variant="primary" />
    </div>
  )
}
