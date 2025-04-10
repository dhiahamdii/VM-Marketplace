"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "./auth/auth-provider"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import PaymentMethodForm from "@/components/stripe/payment-method-form"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface VMDeploymentFormProps {
  vm: {
    id: number
    title: string
    price: number
    regions?: string[]
    specs: {
      cpu: string
      ram: string
      storage: string
      network: string
      backup: string
      os: string
    }
  }
}

export default function VMDeploymentForm({ vm }: VMDeploymentFormProps) {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [region, setRegion] = useState(vm.regions?.[0] || "us-east-1")
  const [quantity, setQuantity] = useState(1)
  const [isDeploying, setIsDeploying] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const totalPrice = vm.price * quantity

  useEffect(() => {
    if (showCheckout && user) {
      const createPaymentIntent = async () => {
        try {
          const response = await fetch("/api/stripe/create-payment-intent", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              vmId: vm.id,
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

      createPaymentIntent()
    }
  }, [showCheckout, user, vm.id, quantity, region, toast])

  const handleDeploy = async () => {
    if (!user) {
      router.push(`/auth/login?callbackUrl=${encodeURIComponent(window.location.href)}`)
      return
    }

    setShowCheckout(true)
  }

  if (!user) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-medium">Sign in to deploy</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            You need to be signed in to deploy this virtual machine.
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
        <h3 className="text-lg font-medium">Deployment Configuration</h3>
        <div className="mt-4 space-y-4">
          <div>
            <label className="text-sm font-medium">Region</label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2"
            >
              {vm.regions?.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Quantity</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2"
            />
          </div>
          <div className="pt-4">
            <div className="flex items-center justify-between border-t pt-4">
              <span className="text-sm font-medium">Total Price</span>
              <span className="text-lg font-semibold">${totalPrice.toFixed(2)}/month</span>
            </div>
          </div>
        </div>
      </div>

      {showCheckout ? (
        clientSecret ? (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <PaymentMethodForm
              vmId={vm.id}
              quantity={quantity}
              region={region}
              onSuccess={() => {
                setShowCheckout(false)
                toast({
                  title: "Success",
                  description: "Payment processed successfully",
                })
              }}
            />
          </Elements>
        ) : error ? (
          <div className="rounded-lg border border-destructive p-6">
            <h3 className="text-lg font-medium text-destructive">Error</h3>
            <p className="mt-2 text-sm text-muted-foreground">{error}</p>
            <Button
              onClick={() => setShowCheckout(false)}
              className="mt-4 w-full"
            >
              Try Again
            </Button>
          </div>
        ) : (
          <div className="rounded-lg border p-6">
            <div className="flex items-center justify-center p-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          </div>
        )
      ) : (
        <Button
          onClick={handleDeploy}
          disabled={isDeploying}
          className="w-full"
        >
          {isDeploying ? "Deploying..." : "Deploy Now"}
        </Button>
      )}
    </div>
  )
}
