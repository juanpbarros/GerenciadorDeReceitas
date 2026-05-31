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

describe('recipe form', () => {
  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem('gr_auth_user', JSON.stringify({ _id: '1', nome: 'Maria', email: 'maria@email.com' }))
  })

  it('adds dynamic ingredient and preparation step fields', async () => {
    const user = userEvent.setup()
    setRoute('/receitas/nova')
    render(<App />)

    await user.type(screen.getByLabelText(/ingrediente 1/i), '2 ovos')
    await user.click(screen.getByRole('button', { name: /\+ adicionar ingrediente/i }))
    await user.type(screen.getByLabelText(/ingrediente 2/i), '1 xícara de leite')

    await user.type(screen.getByLabelText(/etapa 1/i), 'Misture os ingredientes')
    await user.click(screen.getByRole('button', { name: /\+ adicionar etapa/i }))
    await user.type(screen.getByLabelText(/etapa 2/i), 'Leve ao forno')

    expect(screen.getByDisplayValue('2 ovos')).toBeInTheDocument()
    expect(screen.getByDisplayValue('1 xícara de leite')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Misture os ingredientes')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Leve ao forno')).toBeInTheDocument()
  })

  it('shows validation message when required recipe fields are empty', async () => {
    const user = userEvent.setup()
    setRoute('/receitas/nova')
    render(<App />)

    await user.click(screen.getByRole('button', { name: /salvar receita/i }))

    expect(screen.getByRole('alert')).toHaveTextContent(/preencha título/i)
  })

  it('accepts a minimally valid recipe form', async () => {
    const user = userEvent.setup()
    setRoute('/receitas/nova')
    render(<App />)

    await user.type(screen.getByLabelText(/título/i), 'Bolo simples')
    await user.type(screen.getByLabelText(/ingrediente 1/i), '2 ovos')
    await user.type(screen.getByLabelText(/etapa 1/i), 'Misture tudo')
    await user.click(screen.getByRole('button', { name: /salvar receita/i }))

    expect(screen.getByRole('alert')).toHaveTextContent(/pronta para integração/i)
  })
})
