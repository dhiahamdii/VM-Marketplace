"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { VMConfiguration } from "@/components/custom-vm-builder"

interface CustomVMPricingSummaryProps {
  vmConfig: VMConfiguration
  totalPrice: number
}

export default function CustomVMPricingSummary({ vmConfig, totalPrice }: CustomVMPricingSummaryProps) {
  // Get selected addons
  const selectedAddons = vmConfig.addons.filter((addon) => addon.selected)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pricing Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-500">CPU ({vmConfig.cpu.cores} vCPU)</span>
            <span className="font-medium">${vmConfig.cpu.price}/mo</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Memory ({vmConfig.memory.size} GB)</span>
            <span className="font-medium">${vmConfig.memory.price}/mo</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">
              Storage ({vmConfig.storage.size} GB {vmConfig.storage.type})
            </span>
            <span className="font-medium">${vmConfig.storage.price}/mo</span>
          </div>

          {vmConfig.os.price > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-500">OS ({vmConfig.os.name})</span>
              <span className="font-medium">${vmConfig.os.price}/mo</span>
            </div>
          )}

          {vmConfig.region.price > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-500">Region ({vmConfig.region.name})</span>
              <span className="font-medium">${vmConfig.region.price}/mo</span>
            </div>
          )}
        </div>

        {selectedAddons.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <p className="text-sm font-medium">Add-ons</p>
              {selectedAddons.map((addon) => (
                <div key={addon.id} className="flex justify-between">
                  <span className="text-gray-500">{addon.name}</span>
                  <span className="font-medium">${addon.price}/mo</span>
                </div>
              ))}
            </div>
          </>
        )}

        <Separator />

        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>${totalPrice}/mo</span>
        </div>

        <p className="text-xs text-gray-500">
          Prices are shown in USD and billed monthly. Additional taxes may apply depending on your location.
        </p>
      </CardContent>
    </Card>
  )
}
