import { apiClient } from './apiClient'

export async function loginRequest({ email, senha }) {
  const response = await apiClient.post('/auth/login', { email, senha })
  return response.data
}

export async function registerRequest({ nome, email, senha }) {
  const response = await apiClient.post('/auth/register', { nome, email, senha })
  return response.data
}

export async function getCurrentUserRequest() {
  const response = await apiClient.get('/auth/me')
  return response.data
}
