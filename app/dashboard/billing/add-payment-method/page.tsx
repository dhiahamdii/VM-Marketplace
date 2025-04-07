import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import PaymentMethodForm from "@/components/payment-method-form"

export const metadata: Metadata = {
  title: "Add Payment Method | VM Marketplace",
  description: "Add a new payment method to your account",
}

export default function AddPaymentMethodPage() {
  return (
    <div className="container px-4 py-8 mx-auto max-w-2xl">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center gap-2">
          <Link href="/dashboard/billing" className="text-blue-600 hover:text-blue-800">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Add Payment Method</h1>
        </div>

        <PaymentMethodForm />
      </div>
    </div>
  )
}

