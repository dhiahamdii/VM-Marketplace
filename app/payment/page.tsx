"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useStripe } from "@/components/stripe/stripe-provider"
import { useSession } from "next-auth/react"
import StripeCheckout from "@/components/stripe/stripe-checkout"

export default function PaymentPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  const { data: session, status } = useSession()
  const { paymentMethods, loading, error, createCheckoutSession, selectedPaymentMethod, setSelectedPaymentMethod } = useStripe()
  const [showCheckout, setShowCheckout] = useState(false)
  const [processing, setProcessing] = useState(false)

  const vmId = searchParams.get("vmId")
  const quantity = searchParams.get("quantity")
  const region = searchParams.get("region")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login")
      return
    }

    if (!vmId || !quantity || !region) {
      toast({
        title: "Invalid parameters",
        description: "Required parameters are missing",
        variant: "destructive",
      })
      router.push("/marketplace")
    }
  }, [vmId, quantity, region, router, toast, status])

  const handlePayment = async (paymentMethodId: string) => {
    try {
      setProcessing(true)
      const { url } = await createCheckoutSession(Number(vmId), paymentMethodId)
      window.location.href = url
    } catch (err) {
      toast({
        title: "Payment Error",
        description: err instanceof Error ? err.message : "Failed to process payment",
        variant: "destructive",
      })
    } finally {
      setProcessing(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    )
  }

  if (status === "unauthenticated") {
    return null
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Error</h2>
          <p className="text-red-500">{error}</p>
          <Button
            className="mt-4"
            onClick={() => router.push("/marketplace")}
          >
            Back to Marketplace
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Payment</h1>
      
      {paymentMethods.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Select Payment Method</h2>
          <div className="grid gap-4">
            {paymentMethods.map((method) => (
              <Card 
                key={method.id} 
                className={`p-4 cursor-pointer transition-colors ${
                  selectedPaymentMethod?.id === method.id ? 'border-primary' : ''
                }`}
                onClick={() => setSelectedPaymentMethod(method)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      {method.card?.brand} ending in {method.card?.last4}
                    </p>
                    <p className="text-sm text-gray-500">
                      Expires {method.card?.exp_month}/{method.card?.exp_year}
                    </p>
                  </div>
                  <Button
                    variant="default"
                    onClick={(e) => {
                      e.stopPropagation()
                      handlePayment(method.id)
                    }}
                    disabled={processing}
                  >
                    {processing ? "Processing..." : "Pay Now"}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
          <div className="text-center mt-4">
            <Button
              variant="outline"
              onClick={() => setShowCheckout(true)}
            >
              Add New Card
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <p className="mb-4">No payment methods found</p>
          <Button onClick={() => setShowCheckout(true)}>
            Add Payment Method
          </Button>
        </div>
      )}

      {showCheckout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <StripeCheckout
              onSuccess={() => {
                setShowCheckout(false)
                if (selectedPaymentMethod) {
                  handlePayment(selectedPaymentMethod.id)
                }
              }}
              onCancel={() => setShowCheckout(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
} 