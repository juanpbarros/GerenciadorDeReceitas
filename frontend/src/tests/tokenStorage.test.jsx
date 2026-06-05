import {
  TOKEN_KEY,
  clearAuthToken,
  getAuthToken,
  setAuthToken,
} from '../services/tokenStorage'

describe('token storage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('stores and reads the auth token', () => {
    setAuthToken('token-jwt')

    expect(getAuthToken()).toBe('token-jwt')
    expect(localStorage.getItem(TOKEN_KEY)).toBe('token-jwt')
  })

  it('clears the auth token', () => {
    setAuthToken('token-jwt')
    clearAuthToken()

    expect(getAuthToken()).toBeNull()
  })
})
