"use client"

import { PaymentMethod } from "@stripe/stripe-js"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"

interface PaymentMethodListProps {
  paymentMethods: PaymentMethod[]
  selectedPaymentMethod: PaymentMethod | null
  onSelect: (paymentMethod: PaymentMethod) => void
}

export function PaymentMethodList({
  paymentMethods,
  selectedPaymentMethod,
  onSelect,
}: PaymentMethodListProps) {
  if (paymentMethods.length === 0) {
    return (
      <div className="text-center text-muted-foreground">
        No payment methods found. Please add a payment method.
      </div>
    )
  }

  return (
    <RadioGroup
      value={selectedPaymentMethod?.id}
      onValueChange={(value) => {
        const method = paymentMethods.find((pm) => pm.id === value)
        if (method) onSelect(method)
      }}
      className="space-y-4"
    >
      {paymentMethods.map((method) => {
        const card = method.card
        if (!card) return null

        return (
          <Card key={method.id} className="p-4">
            <div className="flex items-center space-x-4">
              <RadioGroupItem value={method.id} id={method.id} />
              <Label htmlFor={method.id} className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    {card.brand && (
                      <span className="capitalize">{card.brand}</span>
                    )}
                    {" •••• "}
                    {card.last4}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Expires {card.exp_month}/{card.exp_year}
                  </div>
                </div>
              </Label>
            </div>
          </Card>
        )
      })}
    </RadioGroup>
  )
} 