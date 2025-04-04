import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Star, ArrowLeft, Server, MemoryStickIcon as Memory, HardDrive, Shield, Clock, Globe } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import VMDeploymentForm from "@/components/vm-deployment-form"
import VMReviews from "@/components/vm-reviews"

// Sample VM data - in a real app, this would come from an API
const vmData = [
  {
    id: 1,
    title: "Ubuntu 22.04 LTS",
    description:
      "General purpose Ubuntu server with latest LTS release. Perfect for web hosting, development, and general server tasks. This VM comes with the latest security patches and updates.",
    longDescription:
      "Ubuntu 22.04 LTS (Jammy Jellyfish) is a long-term support release of Ubuntu, providing security updates and support until April 2027. This VM is configured with a balanced set of resources suitable for a wide range of workloads. The system comes pre-configured with essential packages and security hardening measures.",
    provider: "CloudTech Solutions",
    rating: 4.8,
    reviews: 245,
    price: 5.99,
    image: "/placeholder.svg?height=400&width=600",
    specs: {
      cpu: "2 vCPU",
      ram: "4 GB",
      storage: "80 GB SSD",
      os: "Ubuntu 22.04",
      network: "1 Gbps",
      backup: "Weekly",
    },
    tags: ["Linux", "LTS", "Server"],
    features: [
      "Pre-configured firewall",
      "Automatic security updates",
      "SSH key authentication",
      "Monitoring tools installed",
      "99.9% uptime guarantee",
    ],
    regions: ["US East", "US West", "EU Central", "Asia Pacific"],
  },
  // More VM data would be here...
]

export default function VMDetailsPage({ params }: { params: { id: string } }) {
  const vmId = Number.parseInt(params.id)
  const vm = vmData.find((v) => v.id === vmId)

  if (!vm) {
    notFound()
  }

  return (
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
            <Image src={vm.image || "/placeholder.svg"} alt={vm.title} fill className="object-cover" />
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
              {vm.tags.map((tag) => (
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
                  {vm.features.map((feature, index) => (
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
                  {vm.regions.map((region, index) => (
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
                  <p className="text-gray-700">{vm.specs.cpu}</p>
                  <p className="text-sm text-gray-500 mt-1">Intel Xeon or AMD EPYC processors</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Memory className="h-5 w-5 text-blue-500 mr-2" />
                    <h3 className="font-semibold">Memory</h3>
                  </div>
                  <p className="text-gray-700">{vm.specs.ram}</p>
                  <p className="text-sm text-gray-500 mt-1">DDR4 ECC Memory</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <HardDrive className="h-5 w-5 text-blue-500 mr-2" />
                    <h3 className="font-semibold">Storage</h3>
                  </div>
                  <p className="text-gray-700">{vm.specs.storage}</p>
                  <p className="text-sm text-gray-500 mt-1">NVMe SSD storage for high performance</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Globe className="h-5 w-5 text-blue-500 mr-2" />
                    <h3 className="font-semibold">Network</h3>
                  </div>
                  <p className="text-gray-700">{vm.specs.network}</p>
                  <p className="text-sm text-gray-500 mt-1">Unlimited inbound traffic, 1TB outbound included</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Clock className="h-5 w-5 text-blue-500 mr-2" />
                    <h3 className="font-semibold">Backup</h3>
                  </div>
                  <p className="text-gray-700">{vm.specs.backup}</p>
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
              ${vm.price}
              <span className="text-sm font-normal text-gray-500">/month</span>
            </h2>

            <Separator className="my-4" />

            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-500">CPU</span>
                <span className="font-medium">{vm.specs.cpu}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">RAM</span>
                <span className="font-medium">{vm.specs.ram}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Storage</span>
                <span className="font-medium">{vm.specs.storage}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Operating System</span>
                <span className="font-medium">{vm.specs.os}</span>
              </div>
            </div>

            <VMDeploymentForm vm={vm} />
          </div>
        </div>
      </div>
    </div>
  )
}

