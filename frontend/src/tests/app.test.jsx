import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'
import { getCurrentUserRequest, loginRequest, registerRequest } from '../services/authApi'
import { TOKEN_KEY } from '../services/tokenStorage'

jest.mock('../services/authApi', () => ({
  loginRequest: jest.fn(),
  registerRequest: jest.fn(),
  getCurrentUserRequest: jest.fn(),
}))

function setRoute(path) {
  window.history.pushState({}, '', path)
}

const AUTH_USER = { _id: '1', nome: 'Maria', email: 'maria@email.com' }

function authenticate(user = AUTH_USER, token = 'jwt-token') {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem('gr_auth_user', JSON.stringify(user))
}

beforeEach(() => {
  jest.clearAllMocks()
  getCurrentUserRequest.mockResolvedValue({ user: AUTH_USER })
})

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
    authenticate()
    setRoute('/')
    render(<App />)
    expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /^Receitas$/ })).toBeInTheDocument()
  })

  it('logout returns to /login', async () => {
    const user = userEvent.setup()
    authenticate()
    setRoute('/')
    render(<App />)

    await user.click(screen.getByRole('button', { name: /sair/i }))
    expect(screen.getByRole('heading', { name: /entrar/i })).toBeInTheDocument()
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull()
  })

  it('restores the authenticated user from a saved token', async () => {
    localStorage.setItem(TOKEN_KEY, 'stored-token')
    getCurrentUserRequest.mockResolvedValue({
      user: { _id: '3', nome: 'João', email: 'joao@email.com' },
    })

    setRoute('/')
    render(<App />)

    expect(screen.getByLabelText(/carregando sessão/i)).toBeInTheDocument()
    expect(await screen.findByRole('heading', { name: /dashboard/i })).toBeInTheDocument()
    expect(getCurrentUserRequest).toHaveBeenCalled()
    expect(localStorage.getItem('gr_auth_user')).toContain('joao@email.com')
  })

  it('clears an invalid saved token and redirects to login', async () => {
    localStorage.setItem(TOKEN_KEY, 'invalid-token')
    getCurrentUserRequest.mockRejectedValue(new Error('Token inválido'))

    setRoute('/')
    render(<App />)

    expect(await screen.findByRole('heading', { name: /entrar/i })).toBeInTheDocument()
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull()
    expect(localStorage.getItem('gr_auth_user')).toBeNull()
  })

  it('logs in using the backend auth API', async () => {
    const user = userEvent.setup()
    loginRequest.mockResolvedValue({
      user: { _id: '1', nome: 'Maria', email: 'maria@email.com' },
      token: 'jwt-token-login',
    })

    setRoute('/login')
    render(<App />)

    await user.type(screen.getByLabelText(/email/i), 'maria@email.com')
    await user.type(screen.getByLabelText(/senha/i), '123456')
    await user.click(screen.getByRole('button', { name: /entrar/i }))

    expect(loginRequest).toHaveBeenCalledWith({ email: 'maria@email.com', senha: '123456' })
    expect(localStorage.getItem(TOKEN_KEY)).toBe('jwt-token-login')
    expect(await screen.findByRole('heading', { name: /dashboard/i })).toBeInTheDocument()
  })

  it('registers using the backend auth API', async () => {
    const user = userEvent.setup()
    registerRequest.mockResolvedValue({
      user: { _id: '2', nome: 'Rafaela', email: 'rafaela@email.com' },
      token: 'jwt-token-register',
    })

    setRoute('/register')
    render(<App />)

    await user.type(screen.getByLabelText(/nome/i), 'Rafaela')
    await user.type(screen.getByLabelText(/email/i), 'rafaela@email.com')
    await user.type(screen.getByLabelText(/senha/i), '123456')
    await user.click(screen.getByRole('button', { name: /cadastrar/i }))

    expect(registerRequest).toHaveBeenCalledWith({
      nome: 'Rafaela',
      email: 'rafaela@email.com',
      senha: '123456',
    })
    expect(localStorage.getItem(TOKEN_KEY)).toBe('jwt-token-register')
    expect(await screen.findByRole('heading', { name: /dashboard/i })).toBeInTheDocument()
  })
})

describe('recipes listing', () => {
  beforeEach(() => {
    localStorage.clear()
    authenticate()
  })

  it('renders recipe cards from mock data', () => {
    setRoute('/receitas')
    render(<App />)

    expect(screen.getByRole('heading', { name: /minha biblioteca de receitas/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Bolo de cenoura/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Macarrão alho e óleo/i })).toBeInTheDocument()
    expect(screen.getByText(/6 receitas encontradas/i)).toBeInTheDocument()
  })

  it('shows source only for recipes added from another person', () => {
    setRoute('/receitas')
    render(<App />)

    expect(screen.queryByText(/Receita de Maria/i)).not.toBeInTheDocument()
    expect(screen.getByText(/Receita de Rafaela/i)).toBeInTheDocument()
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
    authenticate()
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

describe('shopping list form', () => {
  beforeEach(() => {
    localStorage.clear()
    authenticate()
  })

  it('adds dynamic shopping list items and marks an item as purchased', async () => {
    const user = userEvent.setup()
    setRoute('/lista-compras')
    render(<App />)

    await user.type(screen.getByLabelText(/nome da lista/i), 'Compras do bolo')
    await user.type(screen.getByLabelText(/item de compra 1/i), 'farinha')
    await user.click(screen.getByRole('button', { name: /\+ adicionar item/i }))
    await user.type(screen.getByLabelText(/item de compra 2/i), 'fermento')
    await user.click(screen.getByRole('checkbox', { name: /marcar item 2 como comprado/i }))

    expect(screen.getByDisplayValue('Compras do bolo')).toBeInTheDocument()
    expect(screen.getByDisplayValue('farinha')).toBeInTheDocument()
    expect(screen.getByDisplayValue('fermento')).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: /marcar item 2 como comprado/i })).toBeChecked()
  })

  it('shows validation message when shopping list is incomplete', async () => {
    const user = userEvent.setup()
    setRoute('/lista-compras')
    render(<App />)

    await user.click(screen.getByRole('button', { name: /salvar lista/i }))

    expect(screen.getByRole('alert')).toHaveTextContent(/preencha o nome da lista/i)
  })

  it('accepts a minimally valid shopping list', async () => {
    const user = userEvent.setup()
    setRoute('/lista-compras')
    render(<App />)

    await user.type(screen.getByLabelText(/nome da lista/i), 'Compras da semana')
    await user.type(screen.getByLabelText(/item de compra 1/i), 'leite')
    await user.click(screen.getByRole('button', { name: /salvar lista/i }))

    expect(screen.getByRole('alert')).toHaveTextContent(/lista de compras pronta/i)
  })
})

describe('comment form', () => {
  beforeEach(() => {
    localStorage.clear()
    authenticate()
  })

  it('shows validation message when comment form is incomplete', async () => {
    const user = userEvent.setup()
    setRoute('/receitas/bolo-cenoura')
    render(<App />)

    await user.click(screen.getByRole('button', { name: /enviar avaliação/i }))

    expect(screen.getByRole('alert')).toHaveTextContent(/preencha o comentário/i)
  })

  it('accepts a valid comment and rating', async () => {
    const user = userEvent.setup()
    setRoute('/receitas/bolo-cenoura')
    render(<App />)

    await user.type(screen.getByLabelText(/comentário/i), 'Ficou muito bom')
    await user.selectOptions(screen.getByLabelText(/nota/i), '5')
    await user.click(screen.getByRole('button', { name: /enviar avaliação/i }))

    expect(screen.getByRole('alert')).toHaveTextContent(/comentário pronto/i)
  })
})

describe('history form', () => {
  beforeEach(() => {
    localStorage.clear()
    authenticate()
  })

  it('shows validation message when history form is incomplete', async () => {
    const user = userEvent.setup()
    setRoute('/historico')
    render(<App />)

    await user.click(screen.getByRole('button', { name: /salvar histórico/i }))

    expect(screen.getByRole('alert')).toHaveTextContent(/selecione uma receita/i)
  })

  it('accepts a minimally valid history record', async () => {
    const user = userEvent.setup()
    setRoute('/historico')
    render(<App />)

    await user.selectOptions(screen.getByLabelText(/receita feita/i), 'bolo-cenoura')
    await user.type(screen.getByLabelText(/^data$/i), '2026-05-31')
    await user.selectOptions(screen.getByLabelText(/nota pessoal opcional/i), '5')
    await user.type(screen.getByLabelText(/observação opcional/i), 'Ficou ótimo para o café.')
    await user.click(screen.getByRole('button', { name: /salvar histórico/i }))

    expect(screen.getByRole('alert')).toHaveTextContent(/registro de histórico pronto/i)
  })
})

