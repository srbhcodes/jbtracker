import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import {
  clearToken,
  fetchMe,
  getToken,
  login as loginRequest,
  register as registerRequest,
  setToken,
} from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    const t = getToken()
    if (!t) {
      setUser(null)
      setLoading(false)
      return
    }
    try {
      const { user: u } = await fetchMe()
      setUser(u)
    } catch {
      clearToken()
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  const login = async (credentials) => {
    const { token, user: u } = await loginRequest(credentials)
    setToken(token)
    setUser(u)
  }

  const register = async (payload) => {
    const { token, user: u } = await registerRequest(payload)
    setToken(token)
    setUser(u)
  }

  const logout = () => {
    clearToken()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
