import React from "react"
import ProtectedRoute from "@/components/auth/protected-routes"
import UserAccountNav from "@/components/user-account-nav"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Home, Server, CreditCard, Settings, Bell } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-10 border-b bg-white">
          <div className="container flex h-16 items-center justify-between px-4">
            <Link href="/" className="flex items-center">
              <span className="font-bold text-xl">VM Marketplace</span>
            </Link>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
                <span className="sr-only">Notifications</span>
              </Button>
              <UserAccountNav />
            </div>
          </div>
        </header>

        <div className="flex flex-1">
          <aside className="hidden w-64 border-r bg-gray-50 md:block">
            <div className="flex h-full flex-col">
              <div className="flex-1 overflow-auto py-2">
                <nav className="grid items-start px-2 text-sm font-medium">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-900 hover:bg-gray-100"
                  >
                    <Home className="h-4 w-4" />
                    Dashboard
                  </Link>
                  <Link
                    href="/marketplace"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-900 hover:bg-gray-100"
                  >
                    <Server className="h-4 w-4" />
                    Marketplace
                  </Link>
                  <Link
                    href="/dashboard/billing"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-900 hover:bg-gray-100"
                  >
                    <CreditCard className="h-4 w-4" />
                    Billing
                  </Link>
                  <Link
                    href="/dashboard/settings"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-900 hover:bg-gray-100"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link>
                </nav>
              </div>
            </div>
          </aside>

          <main className="flex-1">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  )
}

