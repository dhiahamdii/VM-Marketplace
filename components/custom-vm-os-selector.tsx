"use client"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Monitor } from "lucide-react"
import type { VMConfiguration } from "@/components/custom-vm-builder"

interface CustomVMOSSelectorProps {
  vmConfig: VMConfiguration
  updateVMConfig: (updates: Partial<VMConfiguration>) => void
}

export default function CustomVMOSSelector({ vmConfig, updateVMConfig }: CustomVMOSSelectorProps) {
  // OS options
  const osOptions = {
    Linux: [
      { name: "Ubuntu 22.04 LTS", price: 0 },
      { name: "Ubuntu 20.04 LTS", price: 0 },
      { name: "Debian 11", price: 0 },
      { name: "CentOS 9 Stream", price: 0 },
      { name: "Fedora 36", price: 0 },
      { name: "Alpine Linux 3.16", price: 0 },
    ],
    Windows: [
      { name: "Windows Server 2022", price: 20 },
      { name: "Windows Server 2019", price: 15 },
      { name: "Windows 11 Pro", price: 25 },
      { name: "Windows 10 Pro", price: 20 },
    ],
    Custom: [
      { name: "Data Science Workbench", price: 10 },
      { name: "Web Development Stack", price: 5 },
      { name: "Database Server", price: 8 },
      { name: "AI/ML Environment", price: 15 },
      { name: "Game Server", price: 12 },
    ],
  }

  // Handle OS change
  const handleOSChange = (osName: string, osType: "Linux" | "Windows" | "Custom") => {
    const option = osOptions[osType].find((opt) => opt.name === osName)
    if (option) {
      updateVMConfig({
        os: {
          name: option.name,
          type: osType,
          price: option.price,
        },
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Monitor className="h-5 w-5 text-blue-500" />
          <CardTitle>Operating System</CardTitle>
        </div>
        <CardDescription>Select an operating system for your VM</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={vmConfig.os.type} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="Linux">Linux</TabsTrigger>
            <TabsTrigger value="Windows">Windows</TabsTrigger>
            <TabsTrigger value="Custom">Custom Images</TabsTrigger>
          </TabsList>

          <TabsContent value="Linux" className="space-y-4">
            <RadioGroup
              value={vmConfig.os.name}
              onValueChange={(value) => handleOSChange(value, "Linux")}
              className="grid grid-cols-2 gap-4"
            >
              {osOptions.Linux.map((option) => (
                <div key={option.name} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.name} id={`os-${option.name}`} />
                  <Label htmlFor={`os-${option.name}`} className="flex flex-col cursor-pointer">
                    <span className="font-medium">{option.name}</span>
                    <span className="text-sm text-gray-500">{option.price === 0 ? "Free" : `$${option.price}/mo`}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </TabsContent>

          <TabsContent value="Windows" className="space-y-4">
            <RadioGroup
              value={vmConfig.os.name}
              onValueChange={(value) => handleOSChange(value, "Windows")}
              className="grid grid-cols-2 gap-4"
            >
              {osOptions.Windows.map((option) => (
                <div key={option.name} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.name} id={`os-${option.name}`} />
                  <Label htmlFor={`os-${option.name}`} className="flex flex-col cursor-pointer">
                    <span className="font-medium">{option.name}</span>
                    <span className="text-sm text-gray-500">${option.price}/mo</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </TabsContent>

          <TabsContent value="Custom" className="space-y-4">
            <RadioGroup
              value={vmConfig.os.name}
              onValueChange={(value) => handleOSChange(value, "Custom")}
              className="grid grid-cols-2 gap-4"
            >
              {osOptions.Custom.map((option) => (
                <div key={option.name} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.name} id={`os-${option.name}`} />
                  <Label htmlFor={`os-${option.name}`} className="flex flex-col cursor-pointer">
                    <span className="font-medium">{option.name}</span>
                    <span className="text-sm text-gray-500">${option.price}/mo</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
