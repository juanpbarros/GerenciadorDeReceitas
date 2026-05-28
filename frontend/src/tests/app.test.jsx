import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

function setRoute(path) {
  window.history.pushState({}, '', path)
}

describe('routing/auth', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('redirects to /login when not authenticated', () => {
    setRoute('/')
    render(<App />)
    expect(screen.getByRole('heading', { name: /entrar/i })).toBeInTheDocument()
  })

  it('renders dashboard when authenticated', () => {
    localStorage.setItem('gr_auth_user', JSON.stringify({ _id: '1', nome: 'Maria', email: 'maria@email.com' }))
    setRoute('/')
    render(<App />)
    expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /^Receitas$/ })).toBeInTheDocument()
  })

  it('logout returns to /login', async () => {
    const user = userEvent.setup()
    localStorage.setItem('gr_auth_user', JSON.stringify({ _id: '1', nome: 'Maria', email: 'maria@email.com' }))
    setRoute('/')
    render(<App />)

    await user.click(screen.getByRole('button', { name: /sair/i }))
    expect(screen.getByRole('heading', { name: /entrar/i })).toBeInTheDocument()
  })
})
