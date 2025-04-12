import { NextResponse } from "next/server"
import { createVM } from "@/lib/api"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    // Create the VM using the existing API function
    const vm = await createVM(body)
    
    return NextResponse.json(vm)
  } catch (error) {
    console.error("Error creating VM:", error)
    return NextResponse.json(
      { error: "Failed to create VM" },
      { status: 500 }
    )
  }
} 