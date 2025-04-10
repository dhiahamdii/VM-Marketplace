"use client"

import type React from "react"
import type { PaymentMethod } from "@stripe/stripe-js"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "./auth/auth-provider"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useStripe } from "@/components/stripe/stripe-provider"
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
  const { paymentMethods, selectedPaymentMethod, createCheckoutSession } = useStripe()
  const [region, setRegion] = useState(vm.regions?.[0] || "us-east-1")
  const [quantity, setQuantity] = useState(1)
  const [isDeploying, setIsDeploying] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)

  const totalPrice = vm.price * quantity

  const handleDeploy = async () => {
    if (!user) {
      router.push(`/auth/login?callbackUrl=${encodeURIComponent(window.location.href)}`)
      return
    }

    if (!selectedPaymentMethod) {
      setShowCheckout(true)
      return
    }

    try {
      setIsDeploying(true)
      const { url } = await createCheckoutSession(vm.id, selectedPaymentMethod.id)
      if (url) {
        router.push(url)
      } else {
        throw new Error("Failed to create checkout session")
      }
    } catch (error) {
      console.error("Deployment error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to deploy VM. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeploying(false)
    }
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
        <Elements stripe={stripePromise}>
          <PaymentMethodForm
            vmId={vm.id}
            quantity={quantity}
            region={region}
            onSuccess={handleDeploy}
          />
        </Elements>
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
