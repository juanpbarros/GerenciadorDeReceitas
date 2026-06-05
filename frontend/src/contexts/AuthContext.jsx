import { createContext, useEffect, useMemo, useState, useContext } from 'react'
import { getCurrentUserRequest, loginRequest, registerRequest } from '../services/authApi'
import { clearAuthToken, getAuthToken, setAuthToken } from '../services/tokenStorage'

const AuthContext = createContext(null)
const STORAGE_KEY = 'gr_auth_user'

function getStoredUser() {
  const token = getAuthToken()
  const raw = localStorage.getItem(STORAGE_KEY)

  if (!token || !raw) return null

  try {
    return JSON.parse(raw)
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser)
  const [isLoading, setIsLoading] = useState(() => Boolean(getAuthToken() && !getStoredUser()))

  const persist = (nextUser) => {
    setUser(nextUser)
    if (nextUser) localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser))
    else localStorage.removeItem(STORAGE_KEY)
  }

  useEffect(() => {
    const token = getAuthToken()
    if (!token) {
      persist(null)
      setIsLoading(false)
      return undefined
    }

    let isMounted = true

    async function loadAuthenticatedUser() {
      try {
        const { user: authenticatedUser } = await getCurrentUserRequest()
        if (isMounted) persist(authenticatedUser)
      } catch {
        if (isMounted) {
          clearAuthToken()
          persist(null)
        }
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadAuthenticatedUser()

    return () => {
      isMounted = false
    }
  }, [])

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

  const value = useMemo(() => ({ user, isLoading, login, register, logout }), [user, isLoading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
