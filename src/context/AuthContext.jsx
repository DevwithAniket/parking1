import React, { createContext, useState, useContext, useEffect } from 'react'
import { apiService } from '../services/api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('smartpark_token')
      if (!token) {
        setIsAuthLoading(false)
        return
      }

      try {
        const response = await apiService.me()
        setUser(response.data.user)
        setIsAuthenticated(true)
      } catch {
        localStorage.removeItem('smartpark_token')
        setUser(null)
        setIsAuthenticated(false)
      } finally {
        setIsAuthLoading(false)
      }
    }

    restoreSession()
  }, [])

  const login = async (email, password) => {
    const response = await apiService.login(email, password)
    localStorage.setItem('smartpark_token', response.data.token)
    setUser(response.data.user)
    setIsAuthenticated(true)
    return response.data.user
  }

  const register = async (email, password, name) => {
    const response = await apiService.register(email, password, name)
    localStorage.setItem('smartpark_token', response.data.token)
    setUser(response.data.user)
    setIsAuthenticated(true)
    return response.data.user
  }

  const logout = () => {
    localStorage.removeItem('smartpark_token')
    setUser(null)
    setIsAuthenticated(false)
  }

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isAuthLoading, theme, login, register, logout, toggleTheme }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
