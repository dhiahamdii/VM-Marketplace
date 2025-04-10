import { VM } from "@/types/vm"
import axios from "axios"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const response = await fetch(url, {
    ...options,
    credentials: 'include', // This will include cookies
  })

  if (response.status === 401) {
    // Try to refresh token
    try {
      const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      })

      if (!refreshResponse.ok) {
        throw new Error('Token refresh failed')
      }

      // Retry the original request
      return fetchWithAuth(url, options)
    } catch (error) {
      // Redirect to login if refresh fails
      window.location.href = "/auth/login"
      throw new Error("Authentication failed")
    }
  }

  return response
}

export async function login(email: string, password: string) {
  const formData = new URLSearchParams()
  formData.append('username', email)
  formData.append('password', password)

  const response = await fetch(`${API_BASE_URL}/auth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData,
    credentials: 'include',
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || 'Login failed')
  }

  return response.json()
}

export async function register(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || 'Registration failed')
  }

  return response.json()
}

export async function logout() {
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Logout failed')
  }

  // Clear any remaining client-side state
  window.location.href = "/auth/login"
}

export async function listVMs(skip: number = 0, limit: number = 10): Promise<VM[]> {
  const response = await fetchWithAuth(`${API_BASE_URL}/vms/?skip=${skip}&limit=${limit}`)
  if (!response.ok) {
    throw new Error("Failed to fetch VMs")
  }
  return response.json()
}

export async function getVM(id: number): Promise<VM> {
  const response = await fetchWithAuth(`${API_BASE_URL}/vms/${id}`)
  if (!response.ok) {
    throw new Error("Failed to fetch VM")
  }
  return response.json()
}

export async function createVM(vm: Omit<VM, "id">): Promise<VM> {
  const response = await fetchWithAuth(`${API_BASE_URL}/vms/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(vm),
  })
  if (!response.ok) {
    throw new Error("Failed to create VM")
  }
  return response.json()
}

export async function updateVM(id: number, vm: Partial<VM>): Promise<VM> {
  const response = await fetchWithAuth(`${API_BASE_URL}/vms/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(vm),
  })
  if (!response.ok) {
    throw new Error("Failed to update VM")
  }
  return response.json()
}

export async function deleteVM(id: number): Promise<void> {
  const response = await fetchWithAuth(`${API_BASE_URL}/vms/${id}`, {
    method: "DELETE",
  })
  if (!response.ok) {
    throw new Error("Failed to delete VM")
  }
} 