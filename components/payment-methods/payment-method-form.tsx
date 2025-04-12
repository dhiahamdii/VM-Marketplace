import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { api } from '@/lib/api'

interface PaymentMethodFormValues {
  cardNumber: string
  expiryDate: string
  cvv: string
  name: string
}

interface PaymentMethodFormProps {
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function PaymentMethodForm({ onSuccess, onError }: PaymentMethodFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { data: session } = useSession()

  const handleSubmit = async (values: PaymentMethodFormValues) => {
    try {
      setIsLoading(true)
      
      if (!session?.accessToken) {
        throw new Error('No authentication token found')
      }

      const response = await fetch('/api/payment-methods', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || 'Failed to add payment method')
      }

      onSuccess?.()
    } catch (error) {
      console.error('Error adding payment method:', error)
      onError?.(error instanceof Error ? error.message : 'Failed to add payment method')
    } finally {
      setIsLoading(false)
    }
  }

  const createCheckoutSession = async (vmId: number, paymentMethodId: string) => {
    try {
      setIsLoading(true)
      
      const response = await api.post("/stripe/create-payment-intent", {
        amount: 1000, // Amount in cents
        currency: "usd",
        metadata: {
          vmId,
          paymentMethodId
        }
      })
      return response.data
    } catch (err) {
      console.error('Error creating checkout session:', err)
      onError?.(err instanceof Error ? err.message : "Failed to create checkout session")
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // ... rest of the form component
} 