import { createContext, useState, useContext } from 'react'

const RecipeContext = createContext({})

const mockRecipes = [
  {
    _id: '1',
    nome: 'Bolo de Chocolate',
    descricao: 'Bolo fofinho e molhadinho de chocolate',
    modoPreparo: 'Misture os ingredientes secos...',
    tempoPreparo: 40,
    porcoes: 8,
    categoria: { _id: '1', nome: 'Doces' },
    ingredientes: [
      { nome: 'Farinha de trigo', quantidade: '2 xícaras' },
      { nome: 'Açúcar', quantidade: '1 xícara' },
      { nome: 'Chocolate em pó', quantidade: '1/2 xícara' },
    ],
    avaliacaoMedia: 4.5,
    usuario: 'João Silva',
    createdAt: '2024-01-15',
  },
  {
    _id: '2',
    nome: 'Pão de Queijo',
    descricao: 'Pão de queijo mineiro tradicional',
    modoPreparo: 'Misture o polvilho com o óleo...',
    tempoPreparo: 30,
    porcoes: 20,
    categoria: { _id: '2', nome: 'Salgados' },
    ingredientes: [
      { nome: 'Polvilho azedo', quantidade: '500g' },
      { nome: 'Queijo minas', quantidade: '300g' },
      { nome: 'Óleo', quantidade: '1/2 xícara' },
    ],
    avaliacaoMedia: 5,
    usuario: 'Maria Santos',
    createdAt: '2024-02-20',
  },
  {
    _id: '3',
    nome: 'Suco Verde Detox',
    descricao: 'Suco nutritivo para desintoxicar',
    modoPreparo: 'Bata todos os ingredientes no liquidificador...',
    tempoPreparo: 5,
    porcoes: 1,
    categoria: { _id: '3', nome: 'Bebidas' },
    ingredientes: [
      { nome: 'Couve', quantidade: '2 folhas' },
      { nome: 'Limão', quantidade: '1 unidade' },
      { nome: 'Gengibre', quantidade: '1 pedaço' },
    ],
    avaliacaoMedia: 3.5,
    usuario: 'João Silva',
    createdAt: '2024-03-10',
  },
]

const mockCategories = [
  { _id: '1', nome: 'Doces' },
  { _id: '2', nome: 'Salgados' },
  { _id: '3', nome: 'Bebidas' },
  { _id: '4', nome: 'Massas' },
]

const mockIngredients = [
  { _id: '1', nome: 'Farinha de trigo', unidade: 'xícara' },
  { _id: '2', nome: 'Açúcar', unidade: 'xícara' },
  { _id: '3', nome: 'Ovo', unidade: 'unidade' },
  { _id: '4', nome: 'Leite', unidade: 'ml' },
]

export function RecipeProvider({ children }) {
  const [recipes, setRecipes] = useState(mockRecipes)
  const [categories, setCategories] = useState(mockCategories)
  const [ingredients, setIngredients] = useState(mockIngredients)

  const addRecipe = (recipe) => {
    setRecipes([{ ...recipe, _id: String(Date.now()) }, ...recipes])
  }

  const updateRecipe = (id, data) => {
    setRecipes(recipes.map(r => r._id === id ? { ...r, ...data } : r))
  }

  const deleteRecipe = (id) => {
    setRecipes(recipes.filter(r => r._id !== id))
  }

  const addCategory = (category) => {
    setCategories([...categories, { ...category, _id: String(Date.now()) }])
  }

  const updateCategory = (id, data) => {
    setCategories(categories.map(c => c._id === id ? { ...c, ...data } : c))
  }

  const deleteCategory = (id) => {
    setCategories(categories.filter(c => c._id !== id))
  }

  const addIngredient = (ingredient) => {
    setIngredients([...ingredients, { ...ingredient, _id: String(Date.now()) }])
  }

  const updateIngredient = (id, data) => {
    setIngredients(ingredients.map(i => i._id === id ? { ...i, ...data } : i))
  }

  const deleteIngredient = (id) => {
    setIngredients(ingredients.filter(i => i._id !== id))
  }

  return (
    <RecipeContext.Provider value={{
      recipes, addRecipe, updateRecipe, deleteRecipe,
      categories, addCategory, updateCategory, deleteCategory,
      ingredients, addIngredient, updateIngredient, deleteIngredient,
    }}>
      {children}
    </RecipeContext.Provider>
  )
}

export const useRecipes = () => useContext(RecipeContext)
