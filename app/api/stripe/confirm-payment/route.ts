import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil",
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { paymentIntent, paymentIntentClientSecret } = body

    if (!paymentIntent || !paymentIntentClientSecret) {
      return NextResponse.json(
        { error: "Missing payment information" },
        { status: 400 }
      )
    }

    // Verify the payment intent
    const intent = await stripe.paymentIntents.retrieve(paymentIntent)

    if (intent.status !== "succeeded") {
      return NextResponse.json(
        { error: "Payment not successful" },
        { status: 400 }
      )
    }

    // Here you would typically:
    // 1. Create the VM in your infrastructure
    // 2. Store the VM details in your database
    // 3. Create a subscription record
    // 4. Send confirmation email

    // For now, we'll just return success
    return NextResponse.json({
      success: true,
      message: "Payment confirmed and VM deployment initiated",
    })
  } catch (error) {
    console.error("Payment confirmation error:", error)
    return NextResponse.json(
      { error: "Failed to confirm payment" },
      { status: 500 }
    )
  }
} 