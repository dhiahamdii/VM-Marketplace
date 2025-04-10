import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { paymentId: string } }) {
  try {
    const paymentId = params.paymentId

    if (!paymentId) {
      return NextResponse.json({ error: "Payment ID is required" }, { status: 400 })
    }

    // Call your backend API
    const response = await fetch(`${process.env.BACKEND_API_URL}/stripe/payment-status/${paymentId}`, {
      method: "GET",
      headers: {
        // Include auth token if needed
        Authorization: `Bearer ${request.cookies.get("token")?.value || ""}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        { error: errorData.detail || "Failed to get payment status" },
        { status: response.status },
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error getting payment status:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
