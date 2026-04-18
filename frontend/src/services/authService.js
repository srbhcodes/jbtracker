import axios from 'axios'

const apiBase = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')
const TOKEN_KEY = 'jobportal_token'

const api = axios.create({
  baseURL: apiBase ? `${apiBase}/api/auth` : '/api/auth',
})

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token)
  } else {
    localStorage.removeItem(TOKEN_KEY)
  }
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

export async function register({ fullName, username, email, password }) {
  const { data } = await api.post('/register', { fullName, username, email, password })
  return data
}

export async function login({ emailOrUsername, password }) {
  const { data } = await api.post('/login', { emailOrUsername, password })
  return data
}

export async function fetchMe() {
  const token = getToken()
  const { data } = await api.get('/me', {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
  return data
}
