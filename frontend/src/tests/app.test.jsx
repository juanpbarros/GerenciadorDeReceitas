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

describe('recipes listing', () => {
  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem('gr_auth_user', JSON.stringify({ _id: '1', nome: 'Maria', email: 'maria@email.com' }))
  })

  it('renders recipe cards from mock data', () => {
    setRoute('/receitas')
    render(<App />)

    expect(screen.getByRole('heading', { name: /^Receitas$/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Bolo de cenoura/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Macarrão alho e óleo/i })).toBeInTheDocument()
    expect(screen.getByText(/6 receitas encontradas/i)).toBeInTheDocument()
  })

  it('filters recipes by search text', async () => {
    const user = userEvent.setup()
    setRoute('/receitas')
    render(<App />)

    await user.type(screen.getByRole('textbox', { name: /buscar receitas/i }), 'omelete')

    expect(screen.getByRole('link', { name: /Omelete simples/i })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Bolo de cenoura/i })).not.toBeInTheDocument()
    expect(screen.getByText(/1 receita encontrada/i)).toBeInTheDocument()
  })

  it('filters recipes by category', async () => {
    const user = userEvent.setup()
    setRoute('/receitas')
    render(<App />)

    await user.selectOptions(screen.getByRole('combobox', { name: /filtrar por categoria/i }), 'Bebidas')

    expect(screen.getByRole('link', { name: /Suco de abacaxi com hortelã/i })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Tapioca com queijo/i })).not.toBeInTheDocument()
    expect(screen.getByText(/1 receita encontrada/i)).toBeInTheDocument()
  })
})
