import { NextResponse } from "next/server"
import Stripe from "stripe"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set")
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-03-31.basil",
})

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const paymentMethods = await stripe.paymentMethods.list({
      customer: session.user.email,
      type: "card",
    })

    return NextResponse.json(paymentMethods.data)
  } catch (error) {
    console.error("Error fetching payment methods:", error)
    return NextResponse.json(
      { error: "Failed to fetch payment methods" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { paymentMethodId } = await request.json()

    // Attach the payment method to the customer
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: session.user.email,
    })

    // Set as default payment method
    await stripe.customers.update(session.user.email, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error adding payment method:", error)
    return NextResponse.json(
      { error: "Failed to add payment method" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const paymentMethodId = searchParams.get("id")

    if (!paymentMethodId) {
      return NextResponse.json(
        { error: "Payment method ID is required" },
        { status: 400 }
      )
    }

    await stripe.paymentMethods.detach(paymentMethodId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error removing payment method:", error)
    return NextResponse.json(
      { error: "Failed to remove payment method" },
      { status: 500 }
    )
  }
} 