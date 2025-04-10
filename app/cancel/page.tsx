"use client"

import Link from "next/link"
import { XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function PaymentCancelPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-red-100 p-3">
              <XCircle className="h-12 w-12 text-red-600" />
            </div>
          </div>
          <CardTitle>Payment Cancelled</CardTitle>
          <CardDescription>Your payment process was cancelled</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-6">
          <p>You have cancelled the payment process. No charges have been made to your account.</p>
          <p className="text-sm text-gray-500 mt-2">
            If you experienced any issues or have questions, please contact our support team.
          </p>
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
