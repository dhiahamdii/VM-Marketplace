"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Star, ArrowRight, Server, MemoryStickIcon as Memory, HardDrive } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { VirtualMachine } from "@/types/vm"
import { listVMs } from "@/lib/api"

export default function VMListings() {
  const [vms, setVMs] = useState<VirtualMachine[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortOption, setSortOption] = useState("featured")
  const [hoveredVM, setHoveredVM] = useState<number | null>(null)

  useEffect(() => {
    loadVMs()
  }, [])

  async function loadVMs() {
    try {
      setLoading(true)
      const data = await listVMs()
      setVMs(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load VMs')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>
  }

  // Sort VMs based on selected option
  const sortedVMs = [...vms].sort((a, b) => {
    switch (sortOption) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return b.rating - a.rating
      default:
        return 0 // featured - keep original order
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">Showing {vms.length} results</p>
        <div className="flex items-center space-x-2">
          <span className="text-sm">Sort by:</span>
          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sortedVMs.map((vm) => (
          <Card
            key={vm.id}
            className="overflow-hidden transition-all duration-300 hover:shadow-lg"
            onMouseEnter={() => setHoveredVM(vm.id)}
            onMouseLeave={() => setHoveredVM(null)}
          >
            <div className="relative h-48">
              <Image src={vm.image || "/placeholder.svg"} alt={vm.name} fill className="object-cover" />
              <div className="absolute top-2 right-2">
                <Badge variant="secondary" className="bg-white text-gray-900">
                  ${vm.price}/month
                </Badge>
              </div>
            </div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{vm.name}</CardTitle>
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                  <span className="text-sm font-medium">{vm.rating}</span>
                  <span className="text-xs text-gray-500 ml-1">({vm.reviews})</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {vm.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">{vm.description}</p>
              <div className="space-y-2">
                <div>
                  <strong>Specifications:</strong>
                  <ul className="list-disc list-inside">
                    <li>{vm.specifications.cpu_cores} CPU Cores</li>
                    <li>{vm.specifications.ram_gb}GB RAM</li>
                    <li>{vm.specifications.storage_gb}GB Storage</li>
                    <li>OS: {vm.specifications.os_type}</li>
                  </ul>
                </div>
                <div>
                  <strong>Price:</strong> ${vm.price}
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4">Provided by: {vm.provider}</p>
            </CardContent>
            <CardFooter>
              <div className="w-full flex justify-between items-center">
                <Badge variant={vm.status === 'available' ? 'default' : 'secondary'}>
                  {vm.status}
                </Badge>
                <Link href={`/marketplace/${vm.id}`}>
                  <Button
                    className={`transition-all duration-300 ${hoveredVM === vm.id ? "bg-blue-600 hover:bg-blue-700" : ""}`}
                  >
                    View Details
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

