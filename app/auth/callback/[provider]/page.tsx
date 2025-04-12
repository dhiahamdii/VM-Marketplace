"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import React from "react"

export default function OAuthCallbackPage({ params }: { params: { provider: string } }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleCallback = async () => {
      const access_token = searchParams.get("access_token")
      const refresh_token = searchParams.get("refresh_token")

      if (access_token && refresh_token) {
        // Store tokens
        localStorage.setItem("vm_marketplace_token", access_token)
        localStorage.setItem("vm_marketplace_refresh_token", refresh_token)

        // Get user info
        try {
          const response = await fetch("http://localhost:8000/auth/me", {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          })

          if (response.ok) {
            const userData = await response.json()
            localStorage.setItem("vm_marketplace_user", JSON.stringify(userData))
            router.push("/dashboard")
          } else {
            throw new Error("Failed to get user info")
          }
        } catch (error) {
          console.error("Error during callback:", error)
          router.push("/auth/login?error=oauth_failed")
        }
      } else {
        router.push("/auth/login?error=no_tokens")
      }
    }

    handleCallback()
  }, [router, searchParams])

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-lg">Completing {params.provider} login...</p>
      </div>
    </div>
  )
} 