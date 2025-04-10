import { NextResponse } from "next/server"
import Stripe from "stripe"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil",
})

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await request.json()
    const { productId, price } = body

    if (!productId || !price) {
      return new NextResponse("Product ID and price are required", { status: 400 })
    }

    // Get the customer ID from your database based on the user's email
    // For now, we'll use a placeholder
    const customerId = "cus_placeholder" // Replace with actual customer ID lookup

    // Create a checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `VM Instance - ${productId}`,
            },
            unit_amount: price * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?canceled=true`,
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error("Error creating checkout session:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
