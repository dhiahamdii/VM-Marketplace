"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

// Define user type
export interface User {
  id: string
  email: string
  name: string
  role: "user" | "admin" | "provider"
  avatar?: string
}

// Define auth context type
interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string) => Promise<void>
  logout: () => void
  token: string | null
}

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Check for existing session on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("vm_marketplace_token")
    const storedUser = localStorage.getItem("vm_marketplace_user")
    
    if (storedToken && storedUser) {
      try {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Failed to parse stored auth data:", error)
        localStorage.removeItem("vm_marketplace_token")
        localStorage.removeItem("vm_marketplace_user")
      }
    }
    setIsLoading(false)
  }, [])

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const formData = new URLSearchParams()
      formData.append('username', email)
      formData.append('password', password)

      const response = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString()
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Login failed')
      }

      const data = await response.json()
      const { access_token } = data

      // Store token
      setToken(access_token)
      localStorage.setItem("vm_marketplace_token", access_token)

      // Create user object
      const userData = {
        id: email, // Using email as ID for now
        email,
        name: email.split('@')[0],
        role: "user" as const
      }

      setUser(userData)
      localStorage.setItem("vm_marketplace_user", JSON.stringify(userData))

    } catch (error) {
      console.error('Login error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Signup function
  const signup = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await fetch('http://localhost:8000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Signup failed')
      }

      const data = await response.json()
      const { access_token } = data

      // Store token
      setToken(access_token)
      localStorage.setItem("vm_marketplace_token", access_token)

      // Create user object
      const userData = {
        id: email,
        email,
        name: email.split('@')[0],
        role: "user" as const
      }

      setUser(userData)
      localStorage.setItem("vm_marketplace_user", JSON.stringify(userData))

    } catch (error) {
      console.error('Signup error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Logout function
  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("vm_marketplace_token")
    localStorage.removeItem("vm_marketplace_user")
    router.push("/auth/login")
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, token }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

