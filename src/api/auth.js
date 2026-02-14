import { api, setToken } from './client.js'

export async function register(email, password, displayName) {
  const data = await api('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, displayName }),
  })
  setToken(data.token)
  return data.user
}

export async function login(email, password) {
  const data = await api('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  setToken(data.token)
  return data.user
}

export async function getMe() {
  return api('/api/users/me')
}

export async function updateProfile(body) {
  return api('/api/users/me', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

export function logout() {
  setToken(null)
}
