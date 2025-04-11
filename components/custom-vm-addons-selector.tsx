"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield } from "lucide-react"
import type { VMConfiguration } from "@/components/custom-vm-builder"

interface CustomVMAddonsSelectorProps {
  vmConfig: VMConfiguration
  toggleAddon: (addonId: string) => void
}

export default function CustomVMAddonsSelector({ vmConfig, toggleAddon }: CustomVMAddonsSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-blue-500" />
          <CardTitle>Add-ons</CardTitle>
        </div>
        <CardDescription>Select optional add-ons for your VM</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vmConfig.addons.map((addon) => (
            <div key={addon.id} className="flex items-start space-x-2 border rounded-md p-4">
              <Checkbox
                id={`addon-${addon.id}`}
                checked={addon.selected}
                onCheckedChange={() => toggleAddon(addon.id)}
                className="mt-1"
              />
              <div className="space-y-1">
                <Label htmlFor={`addon-${addon.id}`} className="font-medium cursor-pointer">
                  {addon.name} (+${addon.price}/mo)
                </Label>
                <p className="text-sm text-gray-500">{addon.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
