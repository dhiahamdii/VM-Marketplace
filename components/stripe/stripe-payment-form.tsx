"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, CreditCard, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useStripe } from "@/components/stripe/stripe-provider"
import StripeCardElement, { type CardData } from "@/components/stripe/stripe-card-element"
import type { PaymentMethod } from "@/types/stripe"

interface StripePaymentFormProps {
  onSuccess?: (paymentMethodId: string) => void
  buttonText?: string
  saveCard?: boolean
}

export default function StripePaymentForm({
  onSuccess,
  buttonText = "Add Payment Method",
  saveCard = true,
}: StripePaymentFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { addPaymentMethod } = useStripe()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [cardData, setCardData] = useState<CardData | null>(null)
  const [savePaymentMethod, setSavePaymentMethod] = useState(saveCard)
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "error">("idle")

  const handleCardChange = (complete: boolean, data: CardData) => {
    setIsComplete(complete)
    setCardData(data)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isComplete || !cardData) return

    setIsSubmitting(true)
    setPaymentStatus("processing")

    try {
      // Create a new payment method
      const paymentMethodId = await addPaymentMethod(JSON.stringify({
        type: "card",
        card: {
          brand: getCardBrand(cardData.cardNumber),
          last4: cardData.cardNumber.replace(/\s/g, "").slice(-4),
          exp_month: Number.parseInt(cardData.expiryMonth),
          exp_year: Number.parseInt(cardData.expiryYear),
        },
        billingDetails: {
          name: cardData.cardholderName,
        },
        metadata: {
          isDefault: savePaymentMethod ? "true" : "false"
        }
      }))

      setPaymentStatus("success")

      toast({
        title: "Payment Method Added",
        description: "Your payment method has been added successfully.",
      })

      // Wait a moment to show success state
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Call success callback if provided
      if (onSuccess) {
        onSuccess(paymentMethodId)
      } else {
        router.push("/dashboard/billing")
      }
    } catch (error) {
      setPaymentStatus("error")
      toast({
        title: "Error",
        description: "There was a problem adding your payment method.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getCardBrand = (cardNumber: string): string => {
    const cleanNumber = cardNumber.replace(/\s/g, "")

    if (/^4/.test(cleanNumber)) return "visa"
    if (/^5[1-5]/.test(cleanNumber)) return "mastercard"
    if (/^3[47]/.test(cleanNumber)) return "amex"
    if (/^6(?:011|5)/.test(cleanNumber)) return "discover"

    return "unknown"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Information</CardTitle>
        <CardDescription>
          Enter your card details to {saveCard ? "save for future use" : "complete payment"}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {paymentStatus === "success" ? (
            <div className="flex flex-col items-center justify-center py-6 space-y-4">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-medium">Payment Successful</h3>
                <p className="text-sm text-gray-500">Your payment method has been added successfully.</p>
              </div>
            </div>
          ) : (
            <>
              <div className="bg-gray-50 p-4 rounded-lg flex items-center space-x-4 mb-4">
                <CreditCard className="h-6 w-6 text-gray-400" />
                <div>
                  <p className="text-sm font-medium">Secure Payment Processing</p>
                  <p className="text-xs text-gray-500">Your payment information is encrypted and secure.</p>
                </div>
              </div>

              <StripeCardElement onChange={handleCardChange} />

              {saveCard && (
                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox
                    id="saveCard"
                    checked={savePaymentMethod}
                    onCheckedChange={(checked) => setSavePaymentMethod(checked as boolean)}
                  />
                  <Label htmlFor="saveCard" className="text-sm font-normal">
                    Save this card for future payments
                  </Label>
                </div>
              )}
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting || paymentStatus === "success"}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!isComplete || isSubmitting || paymentStatus === "success"}
            className={paymentStatus === "processing" ? "bg-blue-600" : ""}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              buttonText
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
