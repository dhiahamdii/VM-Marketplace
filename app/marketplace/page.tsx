"use client"

import { Suspense } from "react"
import VMListings from "@/components/vm-listings"
import VMFilters from "@/components/vm-filters"
import VMSearchBar from "@/components/vm-search-bar"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import SiteHeader from "@/components/site-header"

function MarketplaceSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-[300px] w-full" />
        ))}
      </div>
    </div>
  )
}

export default function MarketplacePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1">
        <div className="container mx-auto py-6 space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            <aside className="w-full md:w-64">
              <VMFilters />
            </aside>
            <div className="flex-1 space-y-6">
              <VMSearchBar />
              <Separator />
              <Suspense fallback={<MarketplaceSkeleton />}>
                <VMListings />
              </Suspense>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

