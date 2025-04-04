import Link from "next/link"
import type { Metadata } from "next"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Registration Successful | VM Marketplace",
  description: "Your provider registration has been submitted successfully",
}

export default function ProviderRegistrationSuccessPage() {
  return (
    <div className="container px-4 py-16 mx-auto max-w-md">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="bg-green-100 p-3 rounded-full">
          <CheckCircle2 className="h-12 w-12 text-green-600" />
        </div>

        <h1 className="text-2xl font-bold">Registration Submitted!</h1>

        <p className="text-gray-600">
          Thank you for applying to become a VM provider on our marketplace. We've received your application and will
          review it shortly.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-left w-full">
          <h2 className="text-lg font-medium text-blue-800 mb-2">What happens next?</h2>
          <ol className="list-decimal list-inside text-blue-700 space-y-1">
            <li>Our team will review your application (1-3 business days)</li>
            <li>You'll receive an email with our decision</li>
            <li>If approved, you'll get access to the provider dashboard</li>
            <li>You can then start listing your VMs on the marketplace</li>
          </ol>
        </div>

        <div className="pt-4 space-y-4 w-full">
          <Link href="/">
            <Button className="w-full">Return to Homepage</Button>
          </Link>

          <p className="text-sm text-gray-500">
            Have questions?{" "}
            <Link href="/contact" className="text-blue-600 hover:text-blue-800">
              Contact our support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

