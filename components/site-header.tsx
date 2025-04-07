import Link from "next/link"
import UserAccountNav from "@/components/user-account-nav"

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center">
          <span className="font-bold text-xl">VM Marketplace</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/marketplace" className="text-sm font-medium hover:text-blue-600">
            Marketplace
          </Link>
          <Link href="/pricing" className="text-sm font-medium hover:text-blue-600">
            Pricing
          </Link>
          <Link href="/providers" className="text-sm font-medium hover:text-blue-600">
            For Providers
          </Link>
          <Link href="/docs" className="text-sm font-medium hover:text-blue-600">
            Documentation
          </Link>
        </nav>

        <UserAccountNav />
      </div>
    </header>
  )
}

