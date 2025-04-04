"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Star, ArrowRight, Server, MemoryStickIcon as Memory, HardDrive } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Sample VM data - in a real app, this would come from an API
const vmData = [
  {
    id: 1,
    title: "Ubuntu 22.04 LTS",
    description: "General purpose Ubuntu server with latest LTS release",
    provider: "CloudTech Solutions",
    rating: 4.8,
    reviews: 245,
    price: 5.99,
    image: "/placeholder.svg?height=200&width=300",
    specs: {
      cpu: "2 vCPU",
      ram: "4 GB",
      storage: "80 GB SSD",
      os: "Ubuntu 22.04",
    },
    tags: ["Linux", "LTS", "Server"],
  },
  {
    id: 2,
    title: "Windows Server 2022",
    description: "Enterprise-ready Windows Server with SQL Server pre-installed",
    provider: "Microsoft Certified Partner",
    rating: 4.6,
    reviews: 189,
    price: 24.99,
    image: "/placeholder.svg?height=200&width=300",
    specs: {
      cpu: "4 vCPU",
      ram: "16 GB",
      storage: "250 GB SSD",
      os: "Windows Server 2022",
    },
    tags: ["Windows", "SQL Server", "Enterprise"],
  },
  {
    id: 3,
    title: "Data Science Workbench",
    description: "Pre-configured environment for data science with Python, R, and Jupyter",
    provider: "DataLab Inc.",
    rating: 4.9,
    reviews: 312,
    price: 12.99,
    image: "/placeholder.svg?height=200&width=300",
    specs: {
      cpu: "8 vCPU",
      ram: "32 GB",
      storage: "500 GB SSD",
      os: "Ubuntu 22.04",
    },
    tags: ["Data Science", "Python", "Jupyter"],
  },
  {
    id: 4,
    title: "CentOS 8 Web Server",
    description: "Optimized for web hosting with Apache, Nginx, and PHP pre-configured",
    provider: "DevOps Systems",
    rating: 4.7,
    reviews: 178,
    price: 8.99,
    image: "/placeholder.svg?height=200&width=300",
    specs: {
      cpu: "2 vCPU",
      ram: "8 GB",
      storage: "160 GB SSD",
      os: "CentOS 8",
    },
    tags: ["Web Server", "Apache", "Nginx"],
  },
  {
    id: 5,
    title: "AI Development Environment",
    description: "Ready-to-use environment for AI and ML with TensorFlow, PyTorch, and CUDA",
    provider: "AI Cloud Services",
    rating: 4.9,
    reviews: 203,
    price: 29.99,
    image: "/placeholder.svg?height=200&width=300",
    specs: {
      cpu: "8 vCPU",
      ram: "64 GB",
      storage: "500 GB SSD",
      os: "Ubuntu 22.04",
    },
    tags: ["AI", "Machine Learning", "GPU"],
  },
  {
    id: 6,
    title: "Debian 11 Minimal",
    description: "Lightweight Debian server for maximum customization",
    provider: "CloudTech Solutions",
    rating: 4.5,
    reviews: 156,
    price: 3.99,
    image: "/placeholder.svg?height=200&width=300",
    specs: {
      cpu: "1 vCPU",
      ram: "2 GB",
      storage: "40 GB SSD",
      os: "Debian 11",
    },
    tags: ["Linux", "Minimal", "Lightweight"],
  },
]

export default function VMListings() {
  const [sortOption, setSortOption] = useState("featured")
  const [hoveredVM, setHoveredVM] = useState<number | null>(null)

  // Sort VMs based on selected option
  const sortedVMs = [...vmData].sort((a, b) => {
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
        <p className="text-sm text-gray-500">Showing {vmData.length} results</p>
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
              <Image src={vm.image || "/placeholder.svg"} alt={vm.title} fill className="object-cover" />
              <div className="absolute top-2 right-2">
                <Badge variant="secondary" className="bg-white text-gray-900">
                  ${vm.price}/month
                </Badge>
              </div>
            </div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{vm.title}</CardTitle>
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
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center">
                  <Server className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{vm.specs.cpu}</span>
                </div>
                <div className="flex items-center">
                  <Memory className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{vm.specs.ram}</span>
                </div>
                <div className="flex items-center">
                  <HardDrive className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{vm.specs.storage}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium">OS:</span>
                  <span className="ml-2">{vm.specs.os}</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4">Provided by: {vm.provider}</p>
            </CardContent>
            <CardFooter>
              <div className="w-full flex justify-between items-center">
                <span className="font-bold text-lg">${vm.price}/month</span>
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

