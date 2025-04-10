"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import type { VM } from "@/types/vm"
import { getVM } from "@/lib/api"
import VMDeploymentForm from "@/components/vm-deployment-form"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import Image from "next/image"
import { Star, ArrowLeft, Server, MemoryStickIcon as Memory, HardDrive, Shield, Clock, Globe } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import VMReviews from "@/components/vm-reviews"
import SiteHeader from "@/components/site-header"
import { StripeProvider } from "@/components/stripe/stripe-provider"

const defaultSpecs = {
  cpu: "2 vCPU",
  ram: "4 GB",
  storage: "50 GB SSD",
  network: "1 Gbps",
  backup: "Daily",
  os: "Ubuntu 20.04"
}

export default function VMDetailsPage() {
  const params = useParams()
  const [vm, setVM] = useState<VM | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchVM() {
      try {
        const vmId = Number(params.id)
        const data = await getVM(vmId)
        // Ensure specs are properly initialized
        const vmWithDefaults = {
          ...data,
          specs: {
            ...defaultSpecs,
            ...data.specs
          }
        }
        setVM(vmWithDefaults)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load VM details")
      } finally {
        setLoading(false)
      }
    }

    fetchVM()
  }, [params.id])

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <SiteHeader />
        <div className="container px-4 py-8 mx-auto">
          <div className="mb-6">
            <Link href="/marketplace" className="flex items-center text-blue-600 hover:text-blue-800">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Marketplace
            </Link>
          </div>
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <SiteHeader />
        <div className="container px-4 py-8 mx-auto">
          <div className="mb-6">
            <Link href="/marketplace" className="flex items-center text-blue-600 hover:text-blue-800">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Marketplace
            </Link>
          </div>
          <div className="text-red-500">{error}</div>
        </div>
      </div>
    )
  }

  if (!vm) {
    return (
      <div className="flex flex-col min-h-screen">
        <SiteHeader />
        <div className="container px-4 py-8 mx-auto">
          <div className="mb-6">
            <Link href="/marketplace" className="flex items-center text-blue-600 hover:text-blue-800">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Marketplace
            </Link>
          </div>
          <div>VM not found</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <div className="container px-4 py-8 mx-auto">
        <div className="mb-6">
          <Link href="/marketplace" className="flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Marketplace
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden">
              {vm.image ? (
                <Image 
                  src={vm.image}
                  alt={`${vm.title} virtual machine`}
                  width={400}
                  height={300}
                  className="rounded-lg"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <Server className="h-16 w-16 text-gray-400" />
                </div>
              )}
            </div>

            <div>
              <div className="flex justify-between items-start">
                <h1 className="text-3xl font-bold">{vm.title}</h1>
                <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
                  <span className="font-medium">{vm.rating}</span>
                  <span className="text-sm text-gray-500 ml-1">({vm.reviews} reviews)</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {vm.tags?.map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="text-sm">
                    {tag}
                  </Badge>
                ))}
              </div>
              <p className="text-gray-500 mt-4">{vm.description}</p>
              <p className="text-sm text-gray-500 mt-2">Provided by: {vm.provider}</p>
            </div>

            <Tabs defaultValue="overview">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="specs">Specifications</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="space-y-6 pt-4">
                <div>
                  <h2 className="text-xl font-semibold mb-3">Description</h2>
                  <p className="text-gray-700">{vm.longDescription}</p>
                </div>

                <Separator />

                <div>
                  <h2 className="text-xl font-semibold mb-3">Features</h2>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {vm.features?.map((feature: string, index: number) => (
                      <li key={index} className="flex items-center">
                        <Shield className="h-4 w-4 text-green-500 mr-2" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Separator />

                <div>
                  <h2 className="text-xl font-semibold mb-3">Available Regions</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {vm.regions?.map((region: string, index: number) => (
                      <div key={index} className="flex items-center">
                        <Globe className="h-4 w-4 text-blue-500 mr-2" />
                        <span>{region}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="specs" className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Server className="h-5 w-5 text-blue-500 mr-2" />
                      <h3 className="font-semibold">CPU</h3>
                    </div>
                    <p className="text-gray-700">{vm?.specs?.cpu || defaultSpecs.cpu}</p>
                    <p className="text-sm text-gray-500 mt-1">Intel Xeon or AMD EPYC processors</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Memory className="h-5 w-5 text-blue-500 mr-2" />
                      <h3 className="font-semibold">Memory</h3>
                    </div>
                    <p className="text-gray-700">{vm?.specs?.ram || defaultSpecs.ram}</p>
                    <p className="text-sm text-gray-500 mt-1">DDR4 ECC Memory</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <HardDrive className="h-5 w-5 text-blue-500 mr-2" />
                      <h3 className="font-semibold">Storage</h3>
                    </div>
                    <p className="text-gray-700">{vm?.specs?.storage || defaultSpecs.storage}</p>
                    <p className="text-sm text-gray-500 mt-1">NVMe SSD storage for high performance</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Globe className="h-5 w-5 text-blue-500 mr-2" />
                      <h3 className="font-semibold">Network</h3>
                    </div>
                    <p className="text-gray-700">{vm?.specs?.network || defaultSpecs.network}</p>
                    <p className="text-sm text-gray-500 mt-1">Unlimited inbound traffic, 1TB outbound included</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Clock className="h-5 w-5 text-blue-500 mr-2" />
                      <h3 className="font-semibold">Backup</h3>
                    </div>
                    <p className="text-gray-700">{vm?.specs?.backup || defaultSpecs.backup}</p>
                    <p className="text-sm text-gray-500 mt-1">Automated backups with 30-day retention</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="pt-4">
                <VMReviews vmId={vm.id} />
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-20 bg-white border rounded-lg p-6 shadow-sm">
              <h2 className="text-2xl font-bold">
                ${vm?.price || 0}
                <span className="text-sm font-normal text-gray-500">/month</span>
              </h2>

              <Separator className="my-4" />

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-500">CPU</span>
                  <span className="font-medium">{vm?.specs?.cpu || defaultSpecs.cpu}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">RAM</span>
                  <span className="font-medium">{vm?.specs?.ram || defaultSpecs.ram}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Storage</span>
                  <span className="font-medium">{vm?.specs?.storage || defaultSpecs.storage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Operating System</span>
                  <span className="font-medium">{vm?.specs?.os || defaultSpecs.os}</span>
                </div>
              </div>

              {vm && (
                <StripeProvider>
                  <VMDeploymentForm vm={vm} />
                </StripeProvider>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

