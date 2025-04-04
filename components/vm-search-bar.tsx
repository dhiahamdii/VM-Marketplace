"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function VMSearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    // Create new URLSearchParams
    const params = new URLSearchParams(searchParams)

    // Update or remove the 'q' parameter based on searchQuery
    if (searchQuery) {
      params.set("q", searchQuery)
    } else {
      params.delete("q")
    }

    // Navigate to the new URL
    router.push(`/marketplace?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSearch} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          type="text"
          placeholder="Search for VMs by name, OS, or provider..."
          className="pl-10 pr-24"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button type="submit" className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8">
          Search
        </Button>
      </div>
    </form>
  )
}

