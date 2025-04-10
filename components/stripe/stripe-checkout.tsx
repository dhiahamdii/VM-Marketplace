"use client"

import { useState } from "react"
import { useStripe } from "./stripe-provider"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface StripeCheckoutProps {
  onSuccess: () => void
  onCancel: () => void
}

export default function StripeCheckout({ onSuccess, onCancel }: StripeCheckoutProps) {
  const [processing, setProcessing] = useState(false)
  const { addPaymentMethod } = useStripe()
  const { toast } = useToast()
  const [cardNumber, setCardNumber] = useState("")
  const [expMonth, setExpMonth] = useState("")
  const [expYear, setExpYear] = useState("")
  const [cvc, setCvc] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!cardNumber || !expMonth || !expYear || !cvc) {
      toast({
        title: "Error",
        description: "Please fill in all card details",
        variant: "destructive",
      })
      return
    }

    try {
      setProcessing(true)
      // In a real implementation, we would use Stripe Elements
      // This is just a placeholder for the demo
      const dummyPaymentMethodId = "pm_" + Math.random().toString(36).substr(2, 9)
      await addPaymentMethod(dummyPaymentMethodId)
      
      toast({
        title: "Success",
        description: "Payment method added successfully",
      })
      onSuccess()
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to add payment method",
        variant: "destructive",
      })
    } finally {
      setProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Add Payment Method</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
              Card Number
            </label>
            <input
              id="cardNumber"
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="4242 4242 4242 4242"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="expMonth" className="block text-sm font-medium text-gray-700">
                Month
              </label>
              <input
                id="expMonth"
                type="text"
                value={expMonth}
                onChange={(e) => setExpMonth(e.target.value)}
                placeholder="MM"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="expYear" className="block text-sm font-medium text-gray-700">
                Year
              </label>
              <input
                id="expYear"
                type="text"
                value={expYear}
                onChange={(e) => setExpYear(e.target.value)}
                placeholder="YY"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="cvc" className="block text-sm font-medium text-gray-700">
                CVC
              </label>
              <input
                id="cvc"
                type="text"
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
                placeholder="123"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={processing}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={processing}
          >
            {processing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Add Card"
            )}
          </Button>
        </div>
      </Card>
    </form>
  )
}
