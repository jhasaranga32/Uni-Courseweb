import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

const BASE = 'http://localhost:5000/api/auth'

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true)

  // On mount — restore session from localStorage
  useEffect(() => {
    const token = localStorage.getItem('token')
    const saved  = localStorage.getItem('user')
    if (token && saved) {
      setUser(JSON.parse(saved))
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const { data } = await axios.post(`${BASE}/login`, { email, password })
    localStorage.setItem('token', data.token)
    localStorage.setItem('user',  JSON.stringify(data.user))
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
    setUser(data.user)
    return data.user
  }

  const register = async (name, email, password, role = 'user') => {
    const { data } = await axios.post(`${BASE}/register`, { name, email, password, role })
    localStorage.setItem('token', data.token)
    localStorage.setItem('user',  JSON.stringify(data.user))
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
    setUser(data.user)
    return data.user
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    delete axios.defaults.headers.common['Authorization']
    setUser(null)
  }

  const isAdmin = user?.role === 'admin'

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
