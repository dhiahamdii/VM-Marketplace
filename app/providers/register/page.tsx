import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import ProviderRegistrationForm from "@/components/provider-registration-form"

export const metadata: Metadata = {
  title: "Become a Provider | VM Marketplace",
  description: "Register as a VM provider on our marketplace",
}

export default function ProviderRegistrationPage() {
  return (
    <div className="container px-4 py-8 mx-auto max-w-4xl">
      <div className="mb-6">
        <Link href="/" className="flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
      </div>

      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Become a VM Provider</h1>
          <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
            Join our marketplace and offer your virtual machines to thousands of customers worldwide. Complete the form
            below to start the registration process.
          </p>
        </div>

        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <ProviderRegistrationForm />
        </div>

        <div className="text-center text-sm text-gray-500">
          Already a provider?{" "}
          <Link href="/auth/login" className="text-blue-600 hover:text-blue-800">
            Sign in to your account
          </Link>
        </div>
      </div>
    </div>
  )
}

