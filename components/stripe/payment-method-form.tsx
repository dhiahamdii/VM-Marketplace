"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../auth/auth-provider"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useStripe } from "./stripe-provider"
import { PaymentElement } from "@stripe/react-stripe-js"

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
  const { paymentMethods, selectedPaymentMethod, setSelectedPaymentMethod, createCheckoutSession } = useStripe()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      router.push(`/auth/login?callbackUrl=${encodeURIComponent(window.location.href)}`)
      return
    }

    if (!selectedPaymentMethod) {
      toast({
        title: "Error",
        description: "Please select a payment method",
        variant: "destructive",
      })
      return
    }

    try {
      setIsProcessing(true)
      const { url } = await createCheckoutSession(vmId, selectedPaymentMethod.id)
      if (url) {
        router.push(url)
      } else {
        throw new Error("Failed to create checkout session")
      }
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
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Pay Now"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 