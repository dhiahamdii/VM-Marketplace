import { Suspense } from "react"
import type { Metadata } from "next"
import Link from "next/link"
import VMListings from "@/components/vm-listings"
import VMFilters from "@/components/vm-filters"
import VMSearchBar from "@/components/vm-search-bar"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import SiteHeader from "@/components/site-header"

export const metadata: Metadata = {
  title: "VM Marketplace | Browse Virtual Machines",
  description: "Browse and purchase virtual machines from our marketplace",
}

export default function MarketplacePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
    <div className="container px-4 py-8 mx-auto">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">VM Marketplace</h1>
          <p className="text-gray-500 mt-2">Browse and deploy from our selection of pre-configured virtual machines</p>
          <div className="mt-4">
            <Link href="/custom-vm">
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                <span>Build Custom VM</span>
              </Button>
            </Link>
          </div>
        </div>

        <VMSearchBar />

        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/4">
            <div className="sticky top-20">
              <h2 className="text-xl font-semibold mb-4">Filters</h2>
              <VMFilters />
            </div>
          </div>

          <Separator orientation="vertical" className="hidden md:block" />

          <div className="md:w-3/4">
            <Suspense fallback={<VMListingsSkeleton />}>
              <VMListings />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
    </div>

  )
}

function VMListingsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-6">
      {Array(4)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="border rounded-lg p-4 space-y-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <div className="flex justify-between">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-32" />
            </div>
          </div>
        ))}
    </div>
  )
}
