"use client"

import type React from "react"

import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Server, MemoryStickIcon as Memory, HardDrive } from "lucide-react"
import type { VMConfiguration } from "@/components/custom-vm-builder"

interface CustomVMSpecsSelectorProps {
  vmConfig: VMConfiguration
  updateVMConfig: (updates: Partial<VMConfiguration>) => void
}

export default function CustomVMSpecsSelector({ vmConfig, updateVMConfig }: CustomVMSpecsSelectorProps) {
  // CPU options
  const cpuOptions = [
    { cores: 1, price: 5 },
    { cores: 2, price: 10 },
    { cores: 4, price: 20 },
    { cores: 8, price: 40 },
    { cores: 16, price: 80 },
  ]

  // Memory options
  const memoryOptions = [
    { size: 2, price: 10 },
    { size: 4, price: 20 },
    { size: 8, price: 40 },
    { size: 16, price: 80 },
    { size: 32, price: 160 },
    { size: 64, price: 320 },
  ]

  // Storage options
  const storageTypes = [
    { type: "SSD", multiplier: 1 },
    { type: "NVMe SSD", multiplier: 1.5 },
  ]

  // Handle CPU change
  const handleCPUChange = (cores: number) => {
    const option = cpuOptions.find((opt) => opt.cores === cores)
    if (option) {
      updateVMConfig({
        cpu: option,
      })
    }
  }

  // Handle memory change
  const handleMemoryChange = (size: number) => {
    const option = memoryOptions.find((opt) => opt.size === size)
    if (option) {
      updateVMConfig({
        memory: option,
      })
    }
  }

  // Handle storage size change
  const handleStorageSizeChange = (value: number[]) => {
    const size = value[0]
    const basePrice = size / 10
    const multiplier = storageTypes.find((t) => t.type === vmConfig.storage.type)?.multiplier || 1

    updateVMConfig({
      storage: {
        ...vmConfig.storage,
        size,
        price: Math.round(basePrice * multiplier),
      },
    })
  }

  // Handle storage type change
  const handleStorageTypeChange = (type: "SSD" | "NVMe SSD") => {
    const multiplier = storageTypes.find((t) => t.type === type)?.multiplier || 1
    const basePrice = vmConfig.storage.size / 10

    updateVMConfig({
      storage: {
        ...vmConfig.storage,
        type,
        price: Math.round(basePrice * multiplier),
      },
    })
  }

  // Handle VM name change
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateVMConfig({
      name: e.target.value,
    })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="vm-name">VM Name</Label>
        <Input id="vm-name" value={vmConfig.name} onChange={handleNameChange} placeholder="Enter a name for your VM" />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Server className="h-5 w-5 text-blue-500" />
            <CardTitle>CPU</CardTitle>
          </div>
          <CardDescription>Select the number of virtual CPU cores</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={vmConfig.cpu.cores.toString()}
            onValueChange={(value) => handleCPUChange(Number(value))}
            className="grid grid-cols-2 md:grid-cols-5 gap-4"
          >
            {cpuOptions.map((option) => (
              <div key={option.cores} className="flex items-center space-x-2">
                <RadioGroupItem value={option.cores.toString()} id={`cpu-${option.cores}`} />
                <Label htmlFor={`cpu-${option.cores}`} className="flex flex-col cursor-pointer">
                  <span className="font-medium">{option.cores} vCPU</span>
                  <span className="text-sm text-gray-500">${option.price}/mo</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Memory className="h-5 w-5 text-blue-500" />
            <CardTitle>Memory</CardTitle>
          </div>
          <CardDescription>Select the amount of RAM</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={vmConfig.memory.size.toString()}
            onValueChange={(value) => handleMemoryChange(Number(value))}
            className="grid grid-cols-2 md:grid-cols-3 gap-4"
          >
            {memoryOptions.map((option) => (
              <div key={option.size} className="flex items-center space-x-2">
                <RadioGroupItem value={option.size.toString()} id={`memory-${option.size}`} />
                <Label htmlFor={`memory-${option.size}`} className="flex flex-col cursor-pointer">
                  <span className="font-medium">{option.size} GB</span>
                  <span className="text-sm text-gray-500">${option.price}/mo</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <HardDrive className="h-5 w-5 text-blue-500" />
            <CardTitle>Storage</CardTitle>
          </div>
          <CardDescription>Configure storage size and type</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between">
              <Label>Storage Size</Label>
              <span className="font-medium">{vmConfig.storage.size} GB</span>
            </div>
            <Slider
              value={[vmConfig.storage.size]}
              min={20}
              max={2000}
              step={10}
              onValueChange={handleStorageSizeChange}
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>20 GB</span>
              <span>2000 GB</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Storage Type</Label>
            <RadioGroup
              value={vmConfig.storage.type}
              onValueChange={(value) => handleStorageTypeChange(value as "SSD" | "NVMe SSD")}
              className="grid grid-cols-2 gap-4"
            >
              {storageTypes.map((option) => (
                <div key={option.type} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.type} id={`storage-${option.type}`} />
                  <Label htmlFor={`storage-${option.type}`} className="flex flex-col cursor-pointer">
                    <span className="font-medium">{option.type}</span>
                    <span className="text-sm text-gray-500">
                      {option.type === "SSD" ? "Standard performance" : "High performance"}
                    </span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
