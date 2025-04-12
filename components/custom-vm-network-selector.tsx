"use client"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Network } from "lucide-react"
import type { VMConfiguration } from "@/components/custom-vm-builder"

interface CustomVMNetworkSelectorProps {
  vmConfig: VMConfiguration
  updateVMConfig: (updates: Partial<VMConfiguration>) => void
}

export default function CustomVMNetworkSelector({ vmConfig, updateVMConfig }: CustomVMNetworkSelectorProps) {
  // Network type options
  const networkTypes = [
    { type: "Standard", description: "Suitable for general purpose workloads", multiplier: 1 },
    { type: "Premium", description: "Enhanced performance with lower latency", multiplier: 1.5 },
    { type: "Enterprise", description: "Highest performance with SLA guarantees", multiplier: 2 },
  ]

  // Handle bandwidth change
  const handleBandwidthChange = (value: number[]) => {
    const bandwidth = value[0]
    const basePrice = bandwidth * 5
    const multiplier = networkTypes.find((t) => t.type === vmConfig.network.type)?.multiplier || 1

    updateVMConfig({
      network: {
        ...vmConfig.network,
        bandwidth,
        price: Math.round(basePrice * multiplier),
      },
    })
  }

  // Handle network type change
  const handleNetworkTypeChange = (type: "Standard" | "Premium" | "Enterprise") => {
    const multiplier = networkTypes.find((t) => t.type === type)?.multiplier || 1
    const basePrice = vmConfig.network.bandwidth * 5

    updateVMConfig({
      network: {
        ...vmConfig.network,
        type,
        price: Math.round(basePrice * multiplier),
      },
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Network className="h-5 w-5 text-blue-500" />
          <CardTitle>Network Configuration</CardTitle>
        </div>
        <CardDescription>Configure network bandwidth and performance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between">
            <Label>Bandwidth</Label>
            <span className="font-medium">{vmConfig.network.bandwidth} Gbps</span>
          </div>
          <Slider
            value={[vmConfig.network.bandwidth]}
            min={1}
            max={10}
            step={1}
            onValueChange={handleBandwidthChange}
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>1 Gbps</span>
            <span>10 Gbps</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Network Type</Label>
          <RadioGroup
            value={vmConfig.network.type}
            onValueChange={(value) => handleNetworkTypeChange(value as "Standard" | "Premium" | "Enterprise")}
            className="grid grid-cols-1 gap-4"
          >
            {networkTypes.map((option) => (
              <div key={option.type} className="flex items-center space-x-2 border rounded-md p-4">
                <RadioGroupItem value={option.type} id={`network-${option.type}`} />
                <Label htmlFor={`network-${option.type}`} className="flex flex-col cursor-pointer">
                  <span className="font-medium">{option.type}</span>
                  <span className="text-sm text-gray-500">{option.description}</span>
                  <span className="text-sm text-gray-500 mt-1">
                    {option.type === "Standard" ? "No additional cost" : `${option.multiplier}x price multiplier`}
                  </span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  )
}
