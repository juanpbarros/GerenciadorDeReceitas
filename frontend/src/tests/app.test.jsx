import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'
import { getCurrentUserRequest, loginRequest, registerRequest } from '../services/authApi'
import {
  createCommentRequest,
  deleteCommentRequest,
  listCommentsRequest,
  updateCommentRequest,
} from '../services/commentApi'
import {
  createRecipeHistoryRequest,
  deleteRecipeHistoryRequest,
  listRecipeHistoryRequest,
  updateRecipeHistoryRequest,
} from '../services/recipeHistoryApi'
import {
  createRecipeRequest,
  deleteRecipeRequest,
  getRecipeRequest,
  listRecipesRequest,
  updateRecipeRequest,
} from '../services/recipeApi'
import {
  createShoppingListRequest,
  deleteShoppingListRequest,
  listShoppingListsRequest,
  updateShoppingListRequest,
} from '../services/shoppingListApi'
import { TOKEN_KEY } from '../services/tokenStorage'

jest.mock('../services/authApi', () => ({
  loginRequest: jest.fn(),
  registerRequest: jest.fn(),
  getCurrentUserRequest: jest.fn(),
}))

jest.mock('../services/commentApi', () => ({
  createCommentRequest: jest.fn(),
  deleteCommentRequest: jest.fn(),
  listCommentsRequest: jest.fn(),
  updateCommentRequest: jest.fn(),
}))

jest.mock('../services/recipeHistoryApi', () => ({
  createRecipeHistoryRequest: jest.fn(),
  deleteRecipeHistoryRequest: jest.fn(),
  listRecipeHistoryRequest: jest.fn(),
  updateRecipeHistoryRequest: jest.fn(),
}))

jest.mock('../services/recipeApi', () => ({
  createRecipeRequest: jest.fn(),
  deleteRecipeRequest: jest.fn(),
  getRecipeRequest: jest.fn(),
  listRecipesRequest: jest.fn(),
  updateRecipeRequest: jest.fn(),
}))

jest.mock('../services/shoppingListApi', () => ({
  createShoppingListRequest: jest.fn(),
  deleteShoppingListRequest: jest.fn(),
  listShoppingListsRequest: jest.fn(),
  updateShoppingListRequest: jest.fn(),
}))

function setRoute(path) {
  window.history.pushState({}, '', path)
}

const AUTH_USER = { _id: '1', nome: 'Maria', email: 'maria@email.com' }
const API_COMMENTS = [
  {
    id: 'comment-1',
    recipeId: 'bolo-cenoura',
    userId: '2',
    userName: 'Rafaela',
    text: 'Ficou perfeito para o café.',
    rating: 5,
  },
]

const API_RECIPES = [
  {
    id: 'bolo-cenoura',
    title: 'Bolo de cenoura',
    description: 'Bolo caseiro fofinho.',
    ingredients: ['2 cenouras', '2 ovos'],
    preparationSteps: ['Bata tudo', 'Leve ao forno'],
    prepTimeMinutes: 45,
    category: 'Sobremesa',
    origin: 'own',
    sourceName: null,
    rating: 0,
  },
  {
    id: 'macarrao-alho-oleo',
    title: 'Macarrão alho e óleo',
    description: 'Receita rápida.',
    ingredients: ['250g de macarrão', '3 dentes de alho'],
    preparationSteps: ['Cozinhe o macarrão', 'Doure o alho'],
    prepTimeMinutes: 20,
    category: 'Massas',
    origin: 'own',
    sourceName: null,
    rating: 0,
  },
]

const API_HISTORY = [
  {
    id: 'history-1',
    recipeId: 'bolo-cenoura',
    recipeTitle: 'Bolo de cenoura',
    recipeCategory: 'Sobremesa',
    date: '2026-06-10T00:00:00.000Z',
    observation: 'Ficou ?timo para o caf?.',
    personalRating: 5,
  },
]

const API_SHOPPING_LISTS = [
  {
    id: 'shopping-list-1',
    name: 'Compras do bolo',
    items: [
      { id: 'item-1', name: 'farinha', purchased: false },
      { id: 'item-2', name: 'fermento', purchased: true },
    ],
  },
]

function authenticate(user = AUTH_USER, token = 'jwt-token') {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem('gr_auth_user', JSON.stringify(user))
}

beforeEach(() => {
  jest.clearAllMocks()
  getCurrentUserRequest.mockResolvedValue({ user: AUTH_USER })
  createCommentRequest.mockResolvedValue({
    comment: {
      id: 'comment-2',
      recipeId: 'bolo-cenoura',
      userId: AUTH_USER._id,
      userName: AUTH_USER.nome,
      text: 'Ficou muito bom',
      rating: 5,
    },
  })
  deleteCommentRequest.mockResolvedValue()
  listCommentsRequest.mockResolvedValue({ comments: API_COMMENTS })
  createRecipeHistoryRequest.mockResolvedValue({
    historyRecord: {
      id: 'history-2',
      recipeId: 'bolo-cenoura',
      recipeTitle: 'Bolo de cenoura',
      date: '2026-05-31T00:00:00.000Z',
      observation: 'Ficou ótimo para o café.',
      personalRating: 5,
    },
  })
  deleteRecipeHistoryRequest.mockResolvedValue()
  listRecipeHistoryRequest.mockResolvedValue({ history: API_HISTORY })
  updateRecipeHistoryRequest.mockImplementation((id, historyRecord) => Promise.resolve({
    historyRecord: {
      id,
      recipeId: historyRecord.recipeId,
      recipeTitle: 'Bolo de cenoura',
      date: `${historyRecord.date}T00:00:00.000Z`,
      observation: historyRecord.observation,
      personalRating: historyRecord.personalRating,
    },
  }))
  createRecipeRequest.mockResolvedValue({ recipe: API_RECIPES[0] })
  deleteRecipeRequest.mockResolvedValue()
  getRecipeRequest.mockResolvedValue({ recipe: API_RECIPES[0] })
  listRecipesRequest.mockResolvedValue({ recipes: API_RECIPES })
  updateRecipeRequest.mockResolvedValue({ recipe: API_RECIPES[0] })
  createShoppingListRequest.mockResolvedValue({
    shoppingList: {
      id: 'shopping-list-2',
      name: 'Compras da semana',
      items: [{ id: 'item-3', name: 'leite', purchased: false }],
    },
  })
  deleteShoppingListRequest.mockResolvedValue()
  listShoppingListsRequest.mockResolvedValue({ shoppingLists: API_SHOPPING_LISTS })
  updateShoppingListRequest.mockImplementation((id, shoppingList) => Promise.resolve({
    shoppingList: {
      id,
      name: shoppingList.name,
      items: shoppingList.items.map((item, index) => ({
        id: item.id || `updated-item-${index}`,
        name: item.name,
        purchased: item.purchased,
      })),
    },
  }))
  updateCommentRequest.mockResolvedValue({
    comment: {
      id: 'comment-own',
      recipeId: 'bolo-cenoura',
      userId: AUTH_USER._id,
      userName: AUTH_USER.nome,
      text: 'Comentário editado',
      rating: 4,
    },
  })
})

describe('routing/auth', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('redirects to /login when not authenticated', () => {
    setRoute('/')
    render(<App />)
    expect(screen.getByRole('heading', { name: /entrar/i })).toBeInTheDocument()
    expect(getCurrentUserRequest).not.toHaveBeenCalled()
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
    expect(localStorage.getItem('gr_auth_user')).toBeNull()
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

  it('shows an error and keeps session empty when login fails', async () => {
    const user = userEvent.setup()
    loginRequest.mockRejectedValue(new Error('Credenciais inválidas'))

    setRoute('/login')
    render(<App />)

    await user.type(screen.getByLabelText(/email/i), 'maria@email.com')
    await user.type(screen.getByLabelText(/senha/i), 'senha-errada')
    await user.click(screen.getByRole('button', { name: /entrar/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(/não foi possível entrar/i)
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull()
    expect(localStorage.getItem('gr_auth_user')).toBeNull()
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

  it('shows an error and keeps session empty when registration fails', async () => {
    const user = userEvent.setup()
    registerRequest.mockRejectedValue(new Error('Email já cadastrado'))

    setRoute('/register')
    render(<App />)

    await user.type(screen.getByLabelText(/nome/i), 'Rafaela')
    await user.type(screen.getByLabelText(/email/i), 'rafaela@email.com')
    await user.type(screen.getByLabelText(/senha/i), '123456')
    await user.click(screen.getByRole('button', { name: /cadastrar/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(/não foi possível cadastrar/i)
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull()
    expect(localStorage.getItem('gr_auth_user')).toBeNull()
  })
})

describe('recipes listing', () => {
  beforeEach(() => {
    localStorage.clear()
    authenticate()
  })

  it('renders recipe cards from the API', async () => {
    setRoute('/receitas')
    render(<App />)

    expect(screen.getByRole('heading', { name: /minha biblioteca de receitas/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/carregando receitas/i)).toBeInTheDocument()
    expect(await screen.findByRole('link', { name: /Bolo de cenoura/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Macarrão alho e óleo/i })).toBeInTheDocument()
    expect(screen.getByText(/2 receitas encontradas/i)).toBeInTheDocument()
    expect(listRecipesRequest).toHaveBeenCalledWith({ busca: '', categoria: '' })
  })

  it('shows an error when recipes cannot be loaded', async () => {
    listRecipesRequest.mockRejectedValue(new Error('Falha na API'))

    setRoute('/receitas')
    render(<App />)

    expect(await screen.findByRole('alert')).toHaveTextContent(/não foi possível carregar as receitas/i)
  })

  it('searches recipes using the API', async () => {
    const user = userEvent.setup()
    setRoute('/receitas')
    render(<App />)

    await screen.findByRole('link', { name: /Bolo de cenoura/i })
    await user.type(screen.getByRole('textbox', { name: /buscar receitas/i }), 'omelete')

    expect(listRecipesRequest).toHaveBeenLastCalledWith({ busca: 'omelete', categoria: '' })
  })

  it('filters recipes by category using the API', async () => {
    const user = userEvent.setup()
    setRoute('/receitas')
    render(<App />)

    await screen.findByRole('link', { name: /Bolo de cenoura/i })
    await user.selectOptions(screen.getByRole('combobox', { name: /filtrar por categoria/i }), 'Massas')

    expect(listRecipesRequest).toHaveBeenLastCalledWith({ busca: '', categoria: 'Massas' })
  })
})

describe('recipe details', () => {
  beforeEach(() => {
    localStorage.clear()
    authenticate()
  })

  it('loads recipe details from the API', async () => {
    setRoute('/receitas/bolo-cenoura')
    render(<App />)

    expect(screen.getByLabelText(/carregando receita/i)).toBeInTheDocument()
    expect(await screen.findByRole('heading', { name: /Bolo de cenoura/i })).toBeInTheDocument()
    expect(screen.getByText(/2 cenouras/i)).toBeInTheDocument()
    expect(getRecipeRequest).toHaveBeenCalledWith('bolo-cenoura')
  })

  it('shows an error when recipe details cannot be loaded', async () => {
    getRecipeRequest.mockRejectedValue(new Error('Falha na API'))

    setRoute('/receitas/bolo-cenoura')
    render(<App />)

    expect(await screen.findByRole('alert')).toHaveTextContent(/não foi possível carregar a receita/i)
  })

  it('deletes a recipe using the API', async () => {
    const user = userEvent.setup()
    setRoute('/receitas/bolo-cenoura')
    render(<App />)

    await screen.findByRole('heading', { name: /Bolo de cenoura/i })
    await user.click(screen.getByRole('button', { name: /excluir/i }))

    expect(deleteRecipeRequest).toHaveBeenCalledWith('bolo-cenoura')
    expect(await screen.findByRole('heading', { name: /minha biblioteca de receitas/i })).toBeInTheDocument()
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
    expect(createRecipeRequest).not.toHaveBeenCalled()
  })

  it('creates a recipe using the API', async () => {
    const user = userEvent.setup()
    setRoute('/receitas/nova')
    render(<App />)

    await user.type(screen.getByLabelText(/título/i), 'Bolo simples')
    await user.type(screen.getByLabelText(/descrição/i), 'Bolo fácil para o café.')
    await user.type(screen.getByLabelText(/tempo de preparo/i), '30')
    await user.type(screen.getByLabelText(/ingrediente 1/i), '2 ovos')
    await user.type(screen.getByLabelText(/etapa 1/i), 'Misture tudo')
    await user.click(screen.getByRole('button', { name: /salvar receita/i }))

    expect(createRecipeRequest).toHaveBeenCalledWith({
      titulo: 'Bolo simples',
      descricao: 'Bolo fácil para o café.',
      ingredientes: ['2 ovos'],
      modoPreparo: ['Misture tudo'],
      tempoPreparo: 30,
      categoria: 'Café da manhã',
      imagemUrl: '',
    })
    expect(await screen.findByRole('heading', { name: /minha biblioteca de receitas/i })).toBeInTheDocument()
  })

  it('shows an error when recipe creation fails', async () => {
    const user = userEvent.setup()
    createRecipeRequest.mockRejectedValue(new Error('Falha na API'))
    setRoute('/receitas/nova')
    render(<App />)

    await user.type(screen.getByLabelText(/título/i), 'Bolo simples')
    await user.type(screen.getByLabelText(/descrição/i), 'Bolo fácil para o café.')
    await user.type(screen.getByLabelText(/tempo de preparo/i), '30')
    await user.type(screen.getByLabelText(/ingrediente 1/i), '2 ovos')
    await user.type(screen.getByLabelText(/etapa 1/i), 'Misture tudo')
    await user.click(screen.getByRole('button', { name: /salvar receita/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(/não foi possível salvar a receita/i)
  })

  it('loads a recipe and updates it using the API', async () => {
    const user = userEvent.setup()
    setRoute('/receitas/bolo-cenoura/editar')
    render(<App />)

    expect(screen.getByLabelText(/carregando receita/i)).toBeInTheDocument()
    expect(await screen.findByDisplayValue('Bolo de cenoura')).toBeInTheDocument()

    await user.clear(screen.getByLabelText(/título/i))
    await user.type(screen.getByLabelText(/título/i), 'Bolo atualizado')
    await user.click(screen.getByRole('button', { name: /salvar alterações/i }))

    expect(updateRecipeRequest).toHaveBeenCalledWith('bolo-cenoura', {
      titulo: 'Bolo atualizado',
      descricao: 'Bolo caseiro fofinho.',
      ingredientes: ['2 cenouras', '2 ovos'],
      modoPreparo: ['Bata tudo', 'Leve ao forno'],
      tempoPreparo: 45,
      categoria: 'Sobremesa',
      imagemUrl: '',
    })
    expect(await screen.findByRole('heading', { name: /minha biblioteca de receitas/i })).toBeInTheDocument()
  })
})

describe('shopping list form', () => {
  beforeEach(() => {
    localStorage.clear()
    authenticate()
  })

  it('loads shopping lists from the API', async () => {
    setRoute('/lista-compras')
    render(<App />)

    expect(screen.getByLabelText(/carregando listas de compras/i)).toBeInTheDocument()
    expect(await screen.findByText(/Compras do bolo/i)).toBeInTheDocument()
    expect(screen.getByText(/farinha/i)).toBeInTheDocument()
    expect(screen.getByText(/1 de 2 itens comprados/i)).toBeInTheDocument()
    expect(listShoppingListsRequest).toHaveBeenCalled()
  })

  it('shows an error when shopping lists cannot be loaded', async () => {
    listShoppingListsRequest.mockRejectedValue(new Error('Falha na API'))

    setRoute('/lista-compras')
    render(<App />)

    expect(await screen.findByRole('alert')).toHaveTextContent(/não foi possível carregar as listas/i)
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

    expect(createShoppingListRequest).toHaveBeenCalledWith({
      name: 'Compras da semana',
      items: [{ name: 'leite', purchased: false }],
    })
    expect(await screen.findByRole('alert')).toHaveTextContent(/lista de compras salva/i)
    expect(screen.getByText(/Compras da semana/i)).toBeInTheDocument()
  })

  it('updates an existing shopping list', async () => {
    const user = userEvent.setup()
    setRoute('/lista-compras')
    render(<App />)

    await screen.findByText(/Compras do bolo/i)
    await user.click(screen.getByRole('button', { name: /editar/i }))
    await user.clear(screen.getByLabelText(/nome da lista/i))
    await user.type(screen.getByLabelText(/nome da lista/i), 'Compras atualizadas')
    await user.click(screen.getByRole('button', { name: /atualizar lista/i }))

    expect(updateShoppingListRequest).toHaveBeenCalledWith('shopping-list-1', {
      name: 'Compras atualizadas',
      items: [
        { id: 'item-1', name: 'farinha', purchased: false },
        { id: 'item-2', name: 'fermento', purchased: true },
      ],
    })
    expect(await screen.findByRole('alert')).toHaveTextContent(/lista de compras atualizada/i)
  })

  it('marks an existing shopping list item as purchased using the API', async () => {
    const user = userEvent.setup()
    setRoute('/lista-compras')
    render(<App />)

    await screen.findByText(/Compras do bolo/i)
    await user.click(screen.getByRole('checkbox', { name: /marcar farinha como comprado/i }))

    expect(updateShoppingListRequest).toHaveBeenCalledWith('shopping-list-1', {
      id: 'shopping-list-1',
      name: 'Compras do bolo',
      items: [
        { id: 'item-1', name: 'farinha', purchased: true },
        { id: 'item-2', name: 'fermento', purchased: true },
      ],
    })
  })

  it('deletes a shopping list using the API', async () => {
    const user = userEvent.setup()
    setRoute('/lista-compras')
    render(<App />)

    await screen.findByText(/Compras do bolo/i)
    await user.click(screen.getByRole('button', { name: /excluir/i }))

    expect(deleteShoppingListRequest).toHaveBeenCalledWith('shopping-list-1')
    expect(await screen.findByRole('alert')).toHaveTextContent(/lista de compras excluída/i)
    expect(screen.queryByText(/Compras do bolo/i)).not.toBeInTheDocument()
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

    await screen.findByRole('heading', { name: /Bolo de cenoura/i })
    await user.click(screen.getByRole('button', { name: /enviar avaliação/i }))

    expect(screen.getByRole('alert')).toHaveTextContent(/preencha o comentário/i)
  })

  it('loads comments from the backend API', async () => {
    setRoute('/receitas/bolo-cenoura')
    render(<App />)

    await screen.findByRole('heading', { name: /Bolo de cenoura/i })
    expect(await screen.findByText(/Ficou perfeito para o café/i)).toBeInTheDocument()
    expect(screen.getByText(/Rafaela/i)).toBeInTheDocument()
    expect(listCommentsRequest).toHaveBeenCalledWith('bolo-cenoura')
  })

  it('shows an error when comments cannot be loaded', async () => {
    listCommentsRequest.mockRejectedValue(new Error('Falha ao carregar comentários'))

    setRoute('/receitas/bolo-cenoura')
    render(<App />)

    expect(await screen.findByRole('alert')).toHaveTextContent(/não foi possível carregar os comentários/i)
  })

  it('accepts a valid comment and rating', async () => {
    const user = userEvent.setup()
    setRoute('/receitas/bolo-cenoura')
    render(<App />)

    await screen.findByRole('heading', { name: /Bolo de cenoura/i })
    await user.type(screen.getByLabelText(/^comentário$/i), 'Ficou muito bom')
    await user.selectOptions(screen.getByLabelText(/^nota$/i), '5')
    await user.click(screen.getByRole('button', { name: /enviar avaliação/i }))

    expect(createCommentRequest).toHaveBeenCalledWith({
      receita: 'bolo-cenoura',
      texto: 'Ficou muito bom',
      nota: 5,
    })
    expect(await screen.findByRole('alert')).toHaveTextContent(/comentário publicado/i)
    expect(screen.getByText('Ficou muito bom')).toBeInTheDocument()
  })

  it('shows an error when comment creation fails', async () => {
    const user = userEvent.setup()
    createCommentRequest.mockRejectedValue(new Error('Falha ao criar comentário'))
    setRoute('/receitas/bolo-cenoura')
    render(<App />)

    await screen.findByRole('heading', { name: /Bolo de cenoura/i })
    await user.type(screen.getByLabelText(/^comentário$/i), 'Ficou muito bom')
    await user.selectOptions(screen.getByLabelText(/^nota$/i), '5')
    await user.click(screen.getByRole('button', { name: /enviar avaliação/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(/não foi possível publicar/i)
  })

  it('allows the authenticated user to edit their own comment', async () => {
    const user = userEvent.setup()
    listCommentsRequest.mockResolvedValue({
      comments: [
        {
          id: 'comment-own',
          recipeId: 'bolo-cenoura',
          userId: AUTH_USER._id,
          userName: AUTH_USER.nome,
          text: 'Texto antigo',
          rating: 3,
        },
      ],
    })
    setRoute('/receitas/bolo-cenoura')
    render(<App />)

    expect(await screen.findByText('Texto antigo')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /editar comentário/i }))
    await user.clear(screen.getByLabelText(/comentário editado/i))
    await user.type(screen.getByLabelText(/comentário editado/i), 'Comentário editado')
    await user.selectOptions(screen.getByLabelText(/nota editada/i), '4')
    await user.click(screen.getByRole('button', { name: /salvar comentário/i }))

    expect(updateCommentRequest).toHaveBeenCalledWith('comment-own', {
      texto: 'Comentário editado',
      nota: 4,
    })
    expect(await screen.findByText('Comentário editado')).toBeInTheDocument()
  })

  it('allows the authenticated user to delete their own comment', async () => {
    const user = userEvent.setup()
    listCommentsRequest.mockResolvedValue({
      comments: [
        {
          id: 'comment-own',
          recipeId: 'bolo-cenoura',
          userId: AUTH_USER._id,
          userName: AUTH_USER.nome,
          text: 'Comentário para remover',
          rating: 3,
        },
      ],
    })
    setRoute('/receitas/bolo-cenoura')
    render(<App />)

    expect(await screen.findByText('Comentário para remover')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /excluir comentário/i }))

    expect(deleteCommentRequest).toHaveBeenCalledWith('comment-own')
    expect(screen.queryByText('Comentário para remover')).not.toBeInTheDocument()
  })

  it('does not show edit or delete actions for comments from other users', async () => {
    setRoute('/receitas/bolo-cenoura')
    render(<App />)

    expect(await screen.findByText(/Ficou perfeito para o café/i)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /editar comentário/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /excluir comentário/i })).not.toBeInTheDocument()
  })
})

describe('history form', () => {
  beforeEach(() => {
    localStorage.clear()
    authenticate()
  })

  it('loads recipe history from the API', async () => {
    setRoute('/historico')
    render(<App />)

    expect(await screen.findAllByText(/Bolo de cenoura/i)).toHaveLength(2)
    expect(screen.getByText(/Ficou .timo para o caf/i)).toBeInTheDocument()
    expect(screen.getByText(/Nota 5\/5/i)).toBeInTheDocument()
    expect(listRecipeHistoryRequest).toHaveBeenCalled()
    expect(listRecipesRequest).toHaveBeenCalled()
  })

  it('shows an error when recipe history cannot be loaded', async () => {
    listRecipeHistoryRequest.mockRejectedValue(new Error('Falha na API'))

    setRoute('/historico')
    render(<App />)

    expect(await screen.findByRole('alert')).toHaveTextContent(/carregar o hist/i)
  })

  it('shows validation message when history form is incomplete', async () => {
    const user = userEvent.setup()
    setRoute('/historico')
    render(<App />)

    await user.click(screen.getByRole('button', { name: /salvar hist/i }))

    expect(screen.getByRole('alert')).toHaveTextContent(/selecione uma receita/i)
  })

  it('accepts a minimally valid history record', async () => {
    const user = userEvent.setup()
    setRoute('/historico')
    render(<App />)

    await screen.findAllByText(/Bolo de cenoura/i)
    await user.selectOptions(screen.getByLabelText(/receita feita/i), 'bolo-cenoura')
    await user.type(screen.getByLabelText(/^data$/i), '2026-05-31')
    await user.selectOptions(screen.getByLabelText(/nota pessoal opcional/i), '5')
    await user.type(screen.getByLabelText(/observa/i), 'Ficou otimo para o cafe.')
    await user.click(screen.getByRole('button', { name: /salvar hist/i }))

    expect(createRecipeHistoryRequest).toHaveBeenCalledWith({
      recipeId: 'bolo-cenoura',
      date: '2026-05-31',
      observation: 'Ficou otimo para o cafe.',
      personalRating: 5,
    })
    expect(await screen.findByRole('alert')).toHaveTextContent(/registro de hist/i)
  })

  it('updates a history record using the API', async () => {
    const user = userEvent.setup()
    setRoute('/historico')
    render(<App />)

    await screen.findByText(/Ficou .timo para o caf/i)
    await user.click(screen.getByRole('button', { name: /editar/i }))
    await user.clear(screen.getByLabelText(/observa/i))
    await user.type(screen.getByLabelText(/observa/i), 'Ficou melhor ainda.')
    await user.click(screen.getByRole('button', { name: /atualizar hist/i }))

    expect(updateRecipeHistoryRequest).toHaveBeenCalledWith('history-1', {
      recipeId: 'bolo-cenoura',
      date: '2026-06-10',
      observation: 'Ficou melhor ainda.',
      personalRating: 5,
    })
    expect(await screen.findByRole('alert')).toHaveTextContent(/registro de hist/i)
  })

  it('deletes a history record using the API', async () => {
    const user = userEvent.setup()
    setRoute('/historico')
    render(<App />)

    await screen.findByText(/Ficou .timo para o caf/i)
    await user.click(screen.getByRole('button', { name: /excluir/i }))

    expect(deleteRecipeHistoryRequest).toHaveBeenCalledWith('history-1')
    expect(await screen.findByRole('alert')).toHaveTextContent(/registro de hist/i)
    expect(screen.queryByText(/Ficou .timo para o caf/i)).not.toBeInTheDocument()
  })
})
