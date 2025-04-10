"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { PaymentMethod } from "@stripe/stripe-js"
import axios from "axios"
import { PaymentStatus } from "@/types/stripe"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
})

interface StripeContextType {
  stripe: any
  paymentMethods: PaymentMethod[]
  selectedPaymentMethod: PaymentMethod | null
  setSelectedPaymentMethod: (method: PaymentMethod | null) => void
  defaultPaymentMethod: PaymentMethod | null
  loading: boolean
  error: string | null
  fetchPaymentMethods: () => Promise<void>
  addPaymentMethod: (paymentMethodId: string) => Promise<string>
  removePaymentMethod: (paymentMethodId: string) => Promise<void>
  setDefaultPaymentMethod: (paymentMethodId: string) => Promise<void>
  getPaymentMethod: (paymentMethodId: string) => PaymentMethod | undefined
  createCheckoutSession: (vmId: number, paymentMethodId: string) => Promise<{ url: string }>
  getPaymentStatus: (sessionId: string) => Promise<PaymentStatus>
}

const StripeContext = createContext<StripeContextType | undefined>(undefined)

export function useStripe() {
  const context = useContext(StripeContext)
  if (!context) {
    throw new Error("useStripe must be used within a StripeProvider")
  }
  return context
}

interface StripeProviderProps {
  children: ReactNode
}

export function StripeProvider({ children }: StripeProviderProps) {
  const [stripe, setStripe] = useState<any>(null)
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null)
  const [defaultPaymentMethod, setDefaultPaymentMethodState] = useState<PaymentMethod | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        const stripeInstance = await stripePromise
        setStripe(stripeInstance)
      } catch (err) {
        setError("Failed to initialize Stripe")
        console.error("Stripe initialization error:", err)
      }
    }

    initializeStripe()
  }, [])

  const fetchPaymentMethods = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      if (!token) {
        setError("No authentication token found")
        return
      }

      const response = await api.get("/api/stripe/payment-methods", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const methods = response.data
      setPaymentMethods(methods)
      
      // Set default payment method
      const defaultMethod = methods.find((method: PaymentMethod) => method.metadata?.isDefault === "true")
      if (defaultMethod) {
        setDefaultPaymentMethodState(defaultMethod)
        setSelectedPaymentMethod(defaultMethod)
      }
    } catch (err) {
      setError("Failed to fetch payment methods")
      console.error("Error fetching payment methods:", err)
    } finally {
      setLoading(false)
    }
  }

  const addPaymentMethod = async (paymentMethodId: string): Promise<string> => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        setError("No authentication token found")
        throw new Error("No authentication token found")
      }

      const response = await api.post(
        "/api/stripe/payment-methods",
        { paymentMethodId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      await fetchPaymentMethods()
      return paymentMethodId
    } catch (err) {
      setError("Failed to add payment method")
      console.error("Error adding payment method:", err)
      throw err
    }
  }

  const removePaymentMethod = async (paymentMethodId: string) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        setError("No authentication token found")
        return
      }

      await api.delete(`/api/stripe/payment-methods/${paymentMethodId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      await fetchPaymentMethods()
    } catch (err) {
      setError("Failed to remove payment method")
      console.error("Error removing payment method:", err)
      throw err
    }
  }

  const setDefaultPaymentMethod = async (paymentMethodId: string) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        setError("No authentication token found")
        return
      }

      await api.post(
        `/api/stripe/payment-methods/${paymentMethodId}/default`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      await fetchPaymentMethods()
    } catch (err) {
      setError("Failed to set default payment method")
      console.error("Error setting default payment method:", err)
      throw err
    }
  }

  const getPaymentMethod = (paymentMethodId: string) => {
    return paymentMethods.find(m => m.id === paymentMethodId)
  }

  const createCheckoutSession = async (vmId: number, paymentMethodId: string) => {
    try {
      setLoading(true)
      const response = await api.post("/api/stripe/create-checkout-session", {
        vmId,
        paymentMethodId
      })
      return response.data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create checkout session")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getPaymentStatus = async (sessionId: string): Promise<PaymentStatus> => {
    try {
      const response = await api.get(`/api/stripe/checkout-session/${sessionId}`)
      return response.data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get payment status")
      throw err
    }
  }

  useEffect(() => {
    if (stripe) {
      fetchPaymentMethods()
    }
  }, [stripe])

  const value = {
    stripe,
    paymentMethods,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    defaultPaymentMethod,
    loading,
    error,
    fetchPaymentMethods,
    addPaymentMethod,
    removePaymentMethod,
    setDefaultPaymentMethod,
    getPaymentMethod,
    createCheckoutSession,
    getPaymentStatus
  }

  return (
    <StripeContext.Provider value={value}>
      {children}
    </StripeContext.Provider>
  )
}

