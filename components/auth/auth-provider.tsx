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
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Sample user data (in a real app, this would come from a database)
const sampleUsers = [
  {
    id: "1",
    email: "user@example.com",
    password: "password123", // In a real app, this would be hashed
    name: "John Doe",
    role: "user" as const,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    email: "admin@example.com",
    password: "admin123", // In a real app, this would be hashed
    name: "Admin User",
    role: "admin" as const,
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("vm_marketplace_user")
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
      } catch (error) {
        console.error("Failed to parse stored user:", error)
        localStorage.removeItem("vm_marketplace_user")
      }
    }
    setIsLoading(false)
  }, [])

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Find user with matching credentials
    const foundUser = sampleUsers.find((u) => u.email === email && u.password === password)

    if (!foundUser) {
      setIsLoading(false)
      throw new Error("Invalid email or password")
    }

    // Create user object without password
    const { password: _, ...userWithoutPassword } = foundUser

    // Store user in state and localStorage
    setUser(userWithoutPassword)
    localStorage.setItem("vm_marketplace_user", JSON.stringify(userWithoutPassword))

    setIsLoading(false)
  }

  // Signup function
  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Check if user already exists
    if (sampleUsers.some((u) => u.email === email)) {
      setIsLoading(false)
      throw new Error("Email already in use")
    }

    // Create new user
    const newUser = {
      id: `${sampleUsers.length + 1}`,
      email,
      name,
      role: "user" as const,
    }

    // Store user in state and localStorage
    setUser(newUser)
    localStorage.setItem("vm_marketplace_user", JSON.stringify(newUser))

    setIsLoading(false)
  }

  // Logout function
  const logout = () => {
    setUser(null)
    localStorage.removeItem("vm_marketplace_user")
    router.push("/")
  }

  return <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>{children}</AuthContext.Provider>
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

