"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Server, MemoryStickIcon as Memory, HardDrive, Monitor, Globe, CreditCard, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import CustomVMSpecsSelector from "@/components/custom-vm-specs-selector"
import CustomVMOSSelector from "@/components/custom-vm-os-selector"
import CustomVMRegionSelector from "@/components/custom-vm-region-selector"
import CustomVMAddonsSelector from "@/components/custom-vm-addons-selector"
import CustomVMPricingSummary from "@/components/custom-vm-pricing-summary"
import { useStripe } from "@/components/stripe/stripe-provider"
import StripeCheckout from "@/components/stripe/stripe-checkout"
import CustomVMNetworkSelector from "@/components/custom-vm-network-selector"

// Update the VMConfiguration interface to include network settings
export interface VMConfiguration {
  name: string
  cpu: {
    cores: number
    price: number
  }
  memory: {
    size: number
    price: number
  }
  storage: {
    size: number
    type: "SSD" | "NVMe SSD"
    price: number
  }
  network: {
    bandwidth: number
    type: "Standard" | "Premium" | "Enterprise"
    price: number
  }
  os: {
    name: string
    type: "Linux" | "Windows" | "Custom"
    price: number
    icon?: string
  }
  region: {
    name: string
    location: string
    price: number
  }
  addons: {
    id: string
    name: string
    description: string
    price: number
    selected: boolean
  }[]
}

export default function CustomVMBuilder() {
  const router = useRouter()
  const { toast } = useToast()
  const { paymentMethods } = useStripe()
  const [activeTab, setActiveTab] = useState("specs")
  const [showCheckout, setShowCheckout] = useState(false)
  // Update the initial vmConfig state to include network settings
  const [vmConfig, setVMConfig] = useState<VMConfiguration>({
    name: "My Custom VM",
    cpu: {
      cores: 2,
      price: 10,
    },
    memory: {
      size: 4,
      price: 20,
    },
    storage: {
      size: 100,
      type: "SSD",
      price: 10,
    },
    network: {
      bandwidth: 1,
      type: "Standard",
      price: 0,
    },
    os: {
      name: "Ubuntu 22.04 LTS",
      type: "Linux",
      price: 0,
    },
    region: {
      name: "US East",
      location: "Virginia",
      price: 0,
    },
    addons: [
      {
        id: "backup",
        name: "Automated Backups",
        description: "Daily backups with 30-day retention",
        price: 5,
        selected: false,
      },
      {
        id: "monitoring",
        name: "Advanced Monitoring",
        description: "Real-time performance monitoring and alerts",
        price: 10,
        selected: false,
      },
      {
        id: "firewall",
        name: "Advanced Firewall",
        description: "Enterprise-grade firewall with DDoS protection",
        price: 15,
        selected: false,
      },
      {
        id: "loadbalancer",
        name: "Load Balancer",
        description: "Distribute traffic across multiple instances",
        price: 20,
        selected: false,
      },
    ],
  })

  // Calculate total price
  const calculateTotalPrice = () => {
    const basePrice =
      vmConfig.cpu.price +
      vmConfig.memory.price +
      vmConfig.storage.price +
      vmConfig.os.price +
      vmConfig.region.price +
      vmConfig.network.price
    const addonsPrice = vmConfig.addons.reduce((total, addon) => (addon.selected ? total + addon.price : total), 0)
    return basePrice + addonsPrice
  }

  const totalPrice = calculateTotalPrice()

  // Update VM configuration
  const updateVMConfig = (updates: Partial<VMConfiguration>) => {
    setVMConfig((prev) => ({
      ...prev,
      ...updates,
    }))
  }

  // Toggle addon selection
  const toggleAddon = (addonId: string) => {
    setVMConfig((prev) => ({
      ...prev,
      addons: prev.addons.map((addon) => (addon.id === addonId ? { ...addon, selected: !addon.selected } : addon)),
    }))
  }

  // Update the handleNextStep function
  const handleNextStep = () => {
    if (activeTab === "specs") setActiveTab("os")
    else if (activeTab === "os") setActiveTab("network")
    else if (activeTab === "network") setActiveTab("region")
    else if (activeTab === "region") setActiveTab("addons")
    else if (activeTab === "addons") setActiveTab("review")
  }

  // Update the handlePrevStep function
  const handlePrevStep = () => {
    if (activeTab === "review") setActiveTab("addons")
    else if (activeTab === "addons") setActiveTab("region")
    else if (activeTab === "region") setActiveTab("network")
    else if (activeTab === "network") setActiveTab("os")
    else if (activeTab === "os") setActiveTab("specs")
  }

  // Handle deploy
  const handleDeploy = async () => {
    try {
      // Create VM in database
      const response = await fetch('/api/vms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: vmConfig.name,
          description: `Custom VM with ${vmConfig.cpu.cores} vCPU, ${vmConfig.memory.size} GB RAM`,
          specifications: {
            cpu_cores: vmConfig.cpu.cores,
            ram_gb: vmConfig.memory.size,
            storage_gb: vmConfig.storage.size,
            os_type: vmConfig.os.name
          },
          price: totalPrice,
          image_type: vmConfig.os.type,
          status: 'created',
          tags: ['custom-vm', vmConfig.os.type.toLowerCase()]
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create VM');
      }

      const createdVM = await response.json();

      toast({
        title: "VM Created Successfully",
        description: "Your custom VM has been created and stored in the database.",
      });

      // Redirect to the VM details page
      router.push(`/marketplace/${createdVM.id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create VM. Please try again.",
        variant: "destructive",
      });
    }
  }

  // Handle payment success
  const handlePaymentSuccess = (paymentId: string) => {
    toast({
      title: "Payment Successful",
      description: "Your custom VM is being deployed.",
    })

    // Redirect to dashboard
    router.push("/dashboard")
  }

  if (showCheckout) {
    return (
      <StripeCheckout
        amount={totalPrice}
        productId={`custom-vm-${Date.now()}`}
        description={`Custom VM: ${vmConfig.cpu.cores} vCPU, ${vmConfig.memory.size} GB RAM, ${vmConfig.storage.size} GB ${vmConfig.storage.type}`}
        buttonText="Pay & Deploy VM"
        onSuccess={handlePaymentSuccess}
        onCancel={() => setShowCheckout(false)}
      />
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="specs">Specs</TabsTrigger>
            <TabsTrigger value="os">OS</TabsTrigger>
            <TabsTrigger value="network">Network</TabsTrigger>
            <TabsTrigger value="region">Region</TabsTrigger>
            <TabsTrigger value="addons">Add-ons</TabsTrigger>
            <TabsTrigger value="review">Review</TabsTrigger>
          </TabsList>

          <TabsContent value="specs" className="space-y-6">
            <CustomVMSpecsSelector vmConfig={vmConfig} updateVMConfig={updateVMConfig} />

            <div className="flex justify-end">
              <Button onClick={handleNextStep}>
                Next: Operating System
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="os" className="space-y-6">
            <CustomVMOSSelector vmConfig={vmConfig} updateVMConfig={updateVMConfig} />

            <div className="flex justify-between">
              <Button variant="outline" onClick={handlePrevStep}>
                Back
              </Button>
              <Button onClick={handleNextStep}>
                Next: Network
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="network" className="space-y-6">
            <CustomVMNetworkSelector vmConfig={vmConfig} updateVMConfig={updateVMConfig} />

            <div className="flex justify-between">
              <Button variant="outline" onClick={handlePrevStep}>
                Back
              </Button>
              <Button onClick={handleNextStep}>
                Next: Region
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="region" className="space-y-6">
            <CustomVMRegionSelector vmConfig={vmConfig} updateVMConfig={updateVMConfig} />

            <div className="flex justify-between">
              <Button variant="outline" onClick={handlePrevStep}>
                Back
              </Button>
              <Button onClick={handleNextStep}>
                Next: Add-ons
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="addons" className="space-y-6">
            <CustomVMAddonsSelector vmConfig={vmConfig} toggleAddon={toggleAddon} />

            <div className="flex justify-between">
              <Button variant="outline" onClick={handlePrevStep}>
                Back
              </Button>
              <Button onClick={handleNextStep}>
                Review Configuration
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="review" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>VM Configuration Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">CPU</p>
                    <div className="flex items-center">
                      <Server className="h-4 w-4 mr-2 text-blue-500" />
                      <p className="font-medium">{vmConfig.cpu.cores} vCPU</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Memory</p>
                    <div className="flex items-center">
                      <Memory className="h-4 w-4 mr-2 text-blue-500" />
                      <p className="font-medium">{vmConfig.memory.size} GB RAM</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Storage</p>
                    <div className="flex items-center">
                      <HardDrive className="h-4 w-4 mr-2 text-blue-500" />
                      <p className="font-medium">
                        {vmConfig.storage.size} GB {vmConfig.storage.type}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Operating System</p>
                    <div className="flex items-center">
                      <Monitor className="h-4 w-4 mr-2 text-blue-500" />
                      <p className="font-medium">{vmConfig.os.name}</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Region</p>
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 mr-2 text-blue-500" />
                      <p className="font-medium">
                        {vmConfig.region.name} ({vmConfig.region.location})
                      </p>
                    </div>
                  </div>
                </div>

                {/* Add network information to the review tab */}
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Network</p>
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 mr-2 text-blue-500" />
                    <p className="font-medium">
                      {vmConfig.network.bandwidth} Gbps ({vmConfig.network.type})
                    </p>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Add-ons</p>
                  {vmConfig.addons.filter((addon) => addon.selected).length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {vmConfig.addons
                        .filter((addon) => addon.selected)
                        .map((addon) => (
                          <Badge key={addon.id} variant="secondary">
                            {addon.name}
                          </Badge>
                        ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No add-ons selected</p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handlePrevStep}>
                  Back
                </Button>
                <Button onClick={handleDeploy} className="w-full">
                  Create VM
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <div className="lg:col-span-1">
        <div className="sticky top-20">
          <CustomVMPricingSummary vmConfig={vmConfig} totalPrice={totalPrice} />

          {activeTab === "review" && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Ready to Deploy?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Your custom VM is configured and ready to deploy. Click the button below to proceed to payment and
                  deployment.
                </p>
              </CardContent>
              <CardFooter>
                <Button onClick={handleDeploy} className="w-full">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Deploy VM Now
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
