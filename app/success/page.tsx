"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const sessionId = searchParams.get("session_id")

    if (!sessionId) {
      setError("Invalid session ID")
      setIsLoading(false)
      return
    }

    // You could verify the payment status here if needed
    // For now, we'll just simulate a delay
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [searchParams, toast])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Processing Your Payment</CardTitle>
            <CardDescription>Please wait while we confirm your payment...</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-6">
            <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Payment Error</CardTitle>
            <CardDescription>There was a problem with your payment</CardDescription>
          </CardHeader>
          <CardContent className="text-center py-6">
            <p className="text-red-500">{error}</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link href="/dashboard">
              <Button>Return to Dashboard</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <CardTitle>Payment Successful!</CardTitle>
          <CardDescription>Your payment has been processed successfully</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-6">
          <p>Thank you for your purchase. Your VM is now being deployed.</p>
          <p className="text-sm text-gray-500 mt-2">
            You will receive a confirmation email shortly with the details of your purchase.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/dashboard">
            <Button>Go to Dashboard</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
