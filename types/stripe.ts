import type { PaymentMethod as StripePaymentMethod } from "@stripe/stripe-js"

export interface PaymentMethod extends StripePaymentMethod {
  metadata?: {
    isDefault?: string
  }
}

export type PaymentStatus = "processing" | "succeeded" | "failed" 