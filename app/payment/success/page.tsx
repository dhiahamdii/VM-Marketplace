"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const processPayment = async () => {
      try {
        const paymentIntent = searchParams.get("payment_intent")
        const paymentIntentClientSecret = searchParams.get("payment_intent_client_secret")
        const redirectStatus = searchParams.get("redirect_status")

        if (!paymentIntent || !paymentIntentClientSecret || !redirectStatus) {
          throw new Error("Missing payment information")
        }

        if (redirectStatus !== "succeeded") {
          throw new Error("Payment was not successful")
        }

        // Call your backend to confirm the payment and deploy the VM
        const response = await fetch("/api/stripe/confirm-payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("vm_marketplace_token")}`,
          },
          body: JSON.stringify({
            paymentIntent,
            paymentIntentClientSecret,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to confirm payment")
        }

        const data = await response.json()
        
        toast({
          title: "Success",
          description: "Your virtual machine has been deployed successfully!",
        })

        // Redirect to the dashboard after a short delay
        setTimeout(() => {
          router.push("/dashboard")
        }, 2000)
      } catch (err) {
        console.error("Payment processing error:", err)
        setError(err instanceof Error ? err.message : "Failed to process payment")
        toast({
          title: "Error",
          description: "Failed to process payment. Please contact support.",
          variant: "destructive",
        })
      } finally {
        setIsProcessing(false)
      }
    }

    if (user) {
      processPayment()
    }
  }, [user, searchParams, router, toast])

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md p-6">
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="mt-2 text-muted-foreground">
            You need to be signed in to view this page.
          </p>
          <Button
            onClick={() => router.push(`/auth/login?callbackUrl=${encodeURIComponent(window.location.href)}`)}
            className="mt-4 w-full"
          >
            Sign In
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md p-6">
        {isProcessing ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-center text-muted-foreground">
              Processing your payment and deploying your virtual machine...
            </p>
          </div>
        ) : error ? (
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-destructive">Error</h1>
            <p className="text-muted-foreground">{error}</p>
            <Button
              onClick={() => router.push("/dashboard")}
              className="w-full"
            >
              Return to Dashboard
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <h1 className="text-2xl font-bold">Success!</h1>
            <p className="text-muted-foreground">
              Your payment has been processed successfully and your virtual machine is being deployed.
              You will be redirected to your dashboard shortly.
            </p>
            <div className="flex items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          </div>
        )}
      </Card>
    </div>
  )
} 