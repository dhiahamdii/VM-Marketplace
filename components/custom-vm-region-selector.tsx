"use client"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Globe } from "lucide-react"
import type { VMConfiguration } from "@/components/custom-vm-builder"

interface CustomVMRegionSelectorProps {
  vmConfig: VMConfiguration
  updateVMConfig: (updates: Partial<VMConfiguration>) => void
}

export default function CustomVMRegionSelector({ vmConfig, updateVMConfig }: CustomVMRegionSelectorProps) {
  // Region options
  const regionOptions = [
    { name: "US East", location: "Virginia", price: 0 },
    { name: "US West", location: "Oregon", price: 0 },
    { name: "EU Central", location: "Frankfurt", price: 5 },
    { name: "EU West", location: "Ireland", price: 5 },
    { name: "Asia Pacific", location: "Singapore", price: 10 },
    { name: "Asia Pacific", location: "Tokyo", price: 10 },
    { name: "South America", location: "São Paulo", price: 15 },
    { name: "Australia", location: "Sydney", price: 15 },
  ]

  // Handle region change
  const handleRegionChange = (regionName: string, regionLocation: string) => {
    const option = regionOptions.find((opt) => opt.name === regionName && opt.location === regionLocation)
    if (option) {
      updateVMConfig({
        region: {
          name: option.name,
          location: option.location,
          price: option.price,
        },
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Globe className="h-5 w-5 text-blue-500" />
          <CardTitle>Region</CardTitle>
        </div>
        <CardDescription>Select a geographic region for your VM</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={`${vmConfig.region.name}-${vmConfig.region.location}`}
          onValueChange={(value) => {
            const [name, location] = value.split("-")
            handleRegionChange(name, location)
          }}
          className="grid grid-cols-2 gap-4"
        >
          {regionOptions.map((option) => (
            <div key={`${option.name}-${option.location}`} className="flex items-center space-x-2">
              <RadioGroupItem
                value={`${option.name}-${option.location}`}
                id={`region-${option.name}-${option.location}`}
              />
              <Label htmlFor={`region-${option.name}-${option.location}`} className="flex flex-col cursor-pointer">
                <span className="font-medium">{option.name}</span>
                <span className="text-sm text-gray-500">
                  {option.location}
                  {option.price > 0 ? ` (+$${option.price}/mo)` : ""}
                </span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  )
}
