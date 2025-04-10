import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "VM Marketplace",
  description: "Browse and purchase virtual machines",
}

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen">
      {children}
    </div>
  )
} 