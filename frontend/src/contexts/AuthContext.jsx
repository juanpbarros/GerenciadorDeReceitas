import { createContext, useMemo, useState, useContext } from 'react'

const AuthContext = createContext(null)
const STORAGE_KEY = 'gr_auth_user'

const DEFAULT_MOCK_USER = {
  _id: 'mock-user-1',
  nome: 'João Silva',
  email: 'joao@email.com',
}

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
    void password
    persist({ ...DEFAULT_MOCK_USER, email })
  }

  const register = async (nome, email, password) => {
    void password
    persist({ _id: 'mock-user-1', nome, email })
  }

  const logout = () => {
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
