"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../auth/auth-provider"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useStripe } from "./stripe-provider"
import { PaymentElement, useStripe as useStripeHook, useElements } from "@stripe/react-stripe-js"

interface PaymentMethodFormProps {
  vmId: number
  quantity: number
  region: string
  onSuccess: () => void
}

export default function PaymentMethodForm({ vmId, quantity, region, onSuccess }: PaymentMethodFormProps) {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const stripe = useStripeHook()
  const elements = useElements()

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await fetch("/api/stripe/create-payment-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            vmId,
            quantity,
            region,
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to create payment intent")
        }

        const data = await response.json()
        if (!data.clientSecret) {
          throw new Error("No client secret received")
        }
        setClientSecret(data.clientSecret)
      } catch (err) {
        console.error("Payment intent error:", err)
        setError(err instanceof Error ? err.message : "Failed to initialize payment")
        toast({
          title: "Error",
          description: "Failed to initialize payment. Please try again.",
          variant: "destructive",
        })
      }
    }

    if (user) {
      createPaymentIntent()
    }
  }, [user, vmId, quantity, region, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      router.push(`/auth/login?callbackUrl=${encodeURIComponent(window.location.href)}`)
      return
    }

    if (!stripe || !elements) {
      return
    }

    try {
      setIsProcessing(true)
      const { error: submitError } = await elements.submit()
      if (submitError) {
        throw submitError
      }

      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success`,
        },
      })

      if (confirmError) {
        throw confirmError
      }

      onSuccess()
    } catch (error) {
      console.error("Payment error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  if (!user) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-medium">Sign in to add payment method</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            You need to be signed in to add a payment method.
          </p>
          <Button
            onClick={() => router.push(`/auth/login?callbackUrl=${encodeURIComponent(window.location.href)}`)}
            className="mt-4 w-full"
          >
            Sign In
          </Button>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-medium text-destructive">Error</h3>
          <p className="mt-2 text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  if (!clientSecret) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border p-6">
          <div className="flex items-center justify-center p-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border p-6">
        <h3 className="text-lg font-medium">Payment Method</h3>
        <div className="mt-4 space-y-4">
          <PaymentElement />
          <div className="flex items-center justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onSuccess()}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={isProcessing || !stripe || !elements}
            >
              {isProcessing ? "Processing..." : "Pay Now"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 