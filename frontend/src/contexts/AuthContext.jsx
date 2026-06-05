import { createContext, useMemo, useState, useContext } from 'react'
import { loginRequest, registerRequest } from '../services/authApi'
import { clearAuthToken, setAuthToken } from '../services/tokenStorage'

const AuthContext = createContext(null)
const STORAGE_KEY = 'gr_auth_user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    try {
      return JSON.parse(raw)
    } catch {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }
  })

  const persist = (nextUser) => {
    setUser(nextUser)
    if (nextUser) localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser))
    else localStorage.removeItem(STORAGE_KEY)
  }

  const login = async (email, password) => {
    const { user: authenticatedUser, token } = await loginRequest({ email, senha: password })
    setAuthToken(token)
    persist(authenticatedUser)
  }

  const register = async (nome, email, password) => {
    const { user: registeredUser, token } = await registerRequest({ nome, email, senha: password })
    setAuthToken(token)
    persist(registeredUser)
  }

  const logout = () => {
    clearAuthToken()
    persist(null)
  }

  const value = useMemo(() => ({ user, login, register, logout }), [user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
