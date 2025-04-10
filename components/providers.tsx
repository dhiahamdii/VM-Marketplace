"use client"

import { SessionProvider } from "next-auth/react"
import { AuthProvider } from "./auth/auth-provider"
import { StripeProvider } from "./stripe/stripe-provider"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        <StripeProvider>
          {children}
        </StripeProvider>
      </AuthProvider>
    </SessionProvider>
  )
} 