"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"

interface VMDeploymentFormProps {
  vm: {
    id: number
    title: string
    price: number
    regions: string[]
  }
}

export default function VMDeploymentForm({ vm }: VMDeploymentFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [region, setRegion] = useState(vm.regions[0])
  const [quantity, setQuantity] = useState(1)
  const [isDeploying, setIsDeploying] = useState(false)
  const [deploymentStep, setDeploymentStep] = useState(0)

  const totalPrice = vm.price * quantity

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (!isNaN(value) && value > 0 && value <= 10) {
      setQuantity(value)
    }
  }

  const handleDeploy = async () => {
    setIsDeploying(true)

    // Simulate deployment process
    setDeploymentStep(1)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setDeploymentStep(2)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setDeploymentStep(3)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setDeploymentStep(4)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Show success toast
    toast({
      title: "Deployment Successful!",
      description: `${quantity} instance${quantity > 1 ? "s" : ""} of ${vm.title} deployed in ${region}.`,
    })

    // Redirect to dashboard
    router.push("/dashboard")
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="region">Region</Label>
        <Select value={region} onValueChange={setRegion}>
          <SelectTrigger id="region">
            <SelectValue placeholder="Select region" />
          </SelectTrigger>
          <SelectContent>
            {vm.regions.map((r) => (
              <SelectItem key={r} value={r}>
                {r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="quantity">Quantity</Label>
        <Input id="quantity" type="number" min="1" max="10" value={quantity} onChange={handleQuantityChange} />
        <p className="text-xs text-gray-500">Maximum 10 instances per deployment</p>
      </div>

      <Separator className="my-4" />

      <div className="flex justify-between font-medium">
        <span>Total</span>
        <span>${totalPrice.toFixed(2)}/month</span>
      </div>

      {isDeploying ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center">
              {deploymentStep > 0 ? (
                <Check className="h-5 w-5 text-green-500 mr-2" />
              ) : (
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
              )}
              <span className={deploymentStep > 0 ? "text-green-500" : ""}>Validating request</span>
            </div>

            <div className="flex items-center">
              {deploymentStep > 1 ? (
                <Check className="h-5 w-5 text-green-500 mr-2" />
              ) : deploymentStep === 1 ? (
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
              ) : (
                <div className="h-5 w-5 mr-2" />
              )}
              <span className={deploymentStep > 1 ? "text-green-500" : ""}>Processing payment</span>
            </div>

            <div className="flex items-center">
              {deploymentStep > 2 ? (
                <Check className="h-5 w-5 text-green-500 mr-2" />
              ) : deploymentStep === 2 ? (
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
              ) : (
                <div className="h-5 w-5 mr-2" />
              )}
              <span className={deploymentStep > 2 ? "text-green-500" : ""}>
                Provisioning VM{quantity > 1 ? "s" : ""}
              </span>
            </div>

            <div className="flex items-center">
              {deploymentStep > 3 ? (
                <Check className="h-5 w-5 text-green-500 mr-2" />
              ) : deploymentStep === 3 ? (
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
              ) : (
                <div className="h-5 w-5 mr-2" />
              )}
              <span className={deploymentStep > 3 ? "text-green-500" : ""}>Configuring network</span>
            </div>
          </div>

          <Button disabled className="w-full">
            Deploying...
          </Button>
        </div>
      ) : (
        <Button onClick={handleDeploy} className="w-full">
          Deploy Now
        </Button>
      )}

      <p className="text-xs text-center text-gray-500">
        By deploying, you agree to our Terms of Service and Privacy Policy
      </p>
    </div>
  )
}

