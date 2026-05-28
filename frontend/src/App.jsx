import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import PublicLayout from './layouts/PublicLayout'
import AppLayout from './layouts/AppLayout'

import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Recipes from './pages/Recipes'
import RecipeDetail from './pages/RecipeDetail'
import RecipeForm from './pages/RecipeForm'
import Favorites from './pages/Favorites'
import ShoppingLists from './pages/ShoppingLists'
import History from './pages/History'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/receitas" element={<Recipes />} />
            <Route path="/receitas/nova" element={<RecipeForm mode="create" />} />
            <Route path="/receitas/:id" element={<RecipeDetail />} />
            <Route path="/receitas/:id/editar" element={<RecipeForm mode="edit" />} />
            <Route path="/favoritos" element={<Favorites />} />
            <Route path="/lista-compras" element={<ShoppingLists />} />
            <Route path="/historico" element={<History />} />
            <Route path="/perfil" element={<Profile />} />
          </Route>

          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

