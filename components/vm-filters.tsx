"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function VMFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Initialize state from URL params
  const [priceRange, setPriceRange] = useState([0, 100])
  const [selectedOS, setSelectedOS] = useState<string[]>([])
  const [selectedProviders, setSelectedProviders] = useState<string[]>([])
  const [selectedCPU, setSelectedCPU] = useState<string[]>([])
  const [selectedRAM, setSelectedRAM] = useState<string[]>([])

  const operatingSystems = [
    { id: "ubuntu", label: "Ubuntu" },
    { id: "windows", label: "Windows" },
    { id: "centos", label: "CentOS" },
    { id: "debian", label: "Debian" },
    { id: "redhat", label: "Red Hat" },
  ]

  const providers = [
    { id: "cloudtech", label: "CloudTech Solutions" },
    { id: "microsoft", label: "Microsoft Certified Partner" },
    { id: "datalab", label: "DataLab Inc." },
    { id: "devops", label: "DevOps Systems" },
    { id: "aicloud", label: "AI Cloud Services" },
  ]

  const cpuOptions = [
    { id: "1vcpu", label: "1 vCPU" },
    { id: "2vcpu", label: "2 vCPU" },
    { id: "4vcpu", label: "4 vCPU" },
    { id: "8vcpu", label: "8 vCPU" },
    { id: "16vcpu", label: "16+ vCPU" },
  ]

  const ramOptions = [
    { id: "2gb", label: "2 GB" },
    { id: "4gb", label: "4 GB" },
    { id: "8gb", label: "8 GB" },
    { id: "16gb", label: "16 GB" },
    { id: "32gb", label: "32+ GB" },
  ]

  const handleOSChange = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedOS([...selectedOS, id])
    } else {
      setSelectedOS(selectedOS.filter((item) => item !== id))
    }
  }

  const handleProviderChange = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedProviders([...selectedProviders, id])
    } else {
      setSelectedProviders(selectedProviders.filter((item) => item !== id))
    }
  }

  const handleCPUChange = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedCPU([...selectedCPU, id])
    } else {
      setSelectedCPU(selectedCPU.filter((item) => item !== id))
    }
  }

  const handleRAMChange = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedRAM([...selectedRAM, id])
    } else {
      setSelectedRAM(selectedRAM.filter((item) => item !== id))
    }
  }

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams)

    // Update price range
    params.set("minPrice", priceRange[0].toString())
    params.set("maxPrice", priceRange[1].toString())

    // Update OS filters
    if (selectedOS.length > 0) {
      params.set("os", selectedOS.join(","))
    } else {
      params.delete("os")
    }

    // Update provider filters
    if (selectedProviders.length > 0) {
      params.set("provider", selectedProviders.join(","))
    } else {
      params.delete("provider")
    }

    // Update CPU filters
    if (selectedCPU.length > 0) {
      params.set("cpu", selectedCPU.join(","))
    } else {
      params.delete("cpu")
    }

    // Update RAM filters
    if (selectedRAM.length > 0) {
      params.set("ram", selectedRAM.join(","))
    } else {
      params.delete("ram")
    }

    router.push(`/marketplace?${params.toString()}`)
  }

  const resetFilters = () => {
    setPriceRange([0, 100])
    setSelectedOS([])
    setSelectedProviders([])
    setSelectedCPU([])
    setSelectedRAM([])
    router.push("/marketplace")
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-medium">Price Range ($/month)</h3>
        <div className="px-2">
          <Slider defaultValue={priceRange} max={100} step={1} value={priceRange} onValueChange={setPriceRange} />
          <div className="flex justify-between mt-2 text-sm text-gray-500">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>

      <Separator />

      <Accordion type="multiple" defaultValue={["os", "provider", "specs"]}>
        <AccordionItem value="os">
          <AccordionTrigger>Operating System</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {operatingSystems.map((os) => (
                <div key={os.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`os-${os.id}`}
                    checked={selectedOS.includes(os.id)}
                    onCheckedChange={(checked) => handleOSChange(os.id, checked as boolean)}
                  />
                  <Label htmlFor={`os-${os.id}`}>{os.label}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="provider">
          <AccordionTrigger>Provider</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {providers.map((provider) => (
                <div key={provider.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`provider-${provider.id}`}
                    checked={selectedProviders.includes(provider.id)}
                    onCheckedChange={(checked) => handleProviderChange(provider.id, checked as boolean)}
                  />
                  <Label htmlFor={`provider-${provider.id}`}>{provider.label}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="specs">
          <AccordionTrigger>Specifications</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">CPU</h4>
                <div className="space-y-2">
                  {cpuOptions.map((cpu) => (
                    <div key={cpu.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`cpu-${cpu.id}`}
                        checked={selectedCPU.includes(cpu.id)}
                        onCheckedChange={(checked) => handleCPUChange(cpu.id, checked as boolean)}
                      />
                      <Label htmlFor={`cpu-${cpu.id}`}>{cpu.label}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">RAM</h4>
                <div className="space-y-2">
                  {ramOptions.map((ram) => (
                    <div key={ram.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`ram-${ram.id}`}
                        checked={selectedRAM.includes(ram.id)}
                        onCheckedChange={(checked) => handleRAMChange(ram.id, checked as boolean)}
                      />
                      <Label htmlFor={`ram-${ram.id}`}>{ram.label}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex flex-col space-y-2 pt-4">
        <Button onClick={applyFilters}>Apply Filters</Button>
        <Button variant="outline" onClick={resetFilters}>
          Reset Filters
        </Button>
      </div>
    </div>
  )
}

