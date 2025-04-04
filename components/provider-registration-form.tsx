"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const vmTypes = [
  { value: "linux", label: "Linux Servers" },
  { value: "windows", label: "Windows Servers" },
  { value: "data-science", label: "Data Science Environments" },
  { value: "web-hosting", label: "Web Hosting Solutions" },
  { value: "database", label: "Database Servers" },
  { value: "ai-ml", label: "AI/ML Environments" },
  { value: "gaming", label: "Gaming Servers" },
  { value: "custom", label: "Custom Solutions" },
]

const regions = [
  { value: "us-east", label: "US East (N. Virginia)" },
  { value: "us-west", label: "US West (Oregon)" },
  { value: "eu-central", label: "EU Central (Frankfurt)" },
  { value: "eu-west", label: "EU West (Ireland)" },
  { value: "ap-southeast", label: "Asia Pacific (Singapore)" },
  { value: "ap-northeast", label: "Asia Pacific (Tokyo)" },
  { value: "sa-east", label: "South America (São Paulo)" },
]

export default function ProviderRegistrationForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    companyName: "",
    website: "",
    contactName: "",
    email: "",
    phone: "",
    description: "",
    vmTypes: [] as string[],
    regions: [] as string[],
    termsAgreed: false,
  })

  const [openVMTypes, setOpenVMTypes] = useState(false)
  const [openRegions, setOpenRegions] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData({ ...formData, termsAgreed: checked })
  }

  const handleVMTypeSelect = (value: string) => {
    setFormData((prev) => {
      const newVMTypes = prev.vmTypes.includes(value)
        ? prev.vmTypes.filter((type) => type !== value)
        : [...prev.vmTypes, value]

      return { ...prev, vmTypes: newVMTypes }
    })
  }

  const handleRegionSelect = (value: string) => {
    setFormData((prev) => {
      const newRegions = prev.regions.includes(value)
        ? prev.regions.filter((region) => region !== value)
        : [...prev.regions, value]

      return { ...prev, regions: newRegions }
    })
  }

  const nextStep = () => {
    setStep(step + 1)
  }

  const prevStep = () => {
    setStep(step - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    toast({
      title: "Registration Submitted",
      description:
        "Your provider registration has been submitted successfully. We'll review your application and get back to you soon.",
    })

    setIsSubmitting(false)

    // Redirect to success page
    router.push("/providers/register/success")
  }

  const isStepOneValid = () => {
    return (
      formData.companyName.trim() !== "" &&
      formData.website.trim() !== "" &&
      formData.contactName.trim() !== "" &&
      formData.email.trim() !== "" &&
      formData.phone.trim() !== ""
    )
  }

  const isStepTwoValid = () => {
    return formData.description.trim() !== "" && formData.vmTypes.length > 0 && formData.regions.length > 0
  }

  const isStepThreeValid = () => {
    return formData.termsAgreed
  }

  return (
    <Tabs value={`step-${step}`} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="step-1" disabled>
          Company Information
        </TabsTrigger>
        <TabsTrigger value="step-2" disabled>
          VM Offerings
        </TabsTrigger>
        <TabsTrigger value="step-3" disabled>
          Review & Submit
        </TabsTrigger>
      </TabsList>

      <form onSubmit={handleSubmit}>
        <TabsContent value="step-1" className="mt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name *</Label>
              <Input
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Company Website *</Label>
              <Input
                id="website"
                name="website"
                type="url"
                value={formData.website}
                onChange={handleInputChange}
                placeholder="https://"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactName">Contact Person Name *</Label>
            <Input
              id="contactName"
              name="contactName"
              value={formData.contactName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} required />
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Button type="button" onClick={nextStep} disabled={!isStepOneValid()}>
              Next Step
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="step-2" className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Company & VM Offerings Description *</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Tell us about your company and the virtual machines you plan to offer..."
              rows={5}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>VM Types You Plan to Offer *</Label>
            <Popover open={openVMTypes} onOpenChange={setOpenVMTypes}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openVMTypes}
                  className="w-full justify-between"
                >
                  {formData.vmTypes.length > 0 ? `${formData.vmTypes.length} types selected` : "Select VM types..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search VM types..." />
                  <CommandList>
                    <CommandEmpty>No VM type found.</CommandEmpty>
                    <CommandGroup>
                      {vmTypes.map((type) => (
                        <CommandItem
                          key={type.value}
                          value={type.value}
                          onSelect={() => handleVMTypeSelect(type.value)}
                        >
                          <Check
                            className={`mr-2 h-4 w-4 ${
                              formData.vmTypes.includes(type.value) ? "opacity-100" : "opacity-0"
                            }`}
                          />
                          {type.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {formData.vmTypes.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {formData.vmTypes.map((type) => {
                  const typeLabel = vmTypes.find((t) => t.value === type)?.label
                  return (
                    <div key={type} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {typeLabel}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Regions You Plan to Serve *</Label>
            <Popover open={openRegions} onOpenChange={setOpenRegions}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openRegions}
                  className="w-full justify-between"
                >
                  {formData.regions.length > 0 ? `${formData.regions.length} regions selected` : "Select regions..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search regions..." />
                  <CommandList>
                    <CommandEmpty>No region found.</CommandEmpty>
                    <CommandGroup>
                      {regions.map((region) => (
                        <CommandItem
                          key={region.value}
                          value={region.value}
                          onSelect={() => handleRegionSelect(region.value)}
                        >
                          <Check
                            className={`mr-2 h-4 w-4 ${
                              formData.regions.includes(region.value) ? "opacity-100" : "opacity-0"
                            }`}
                          />
                          {region.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {formData.regions.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {formData.regions.map((region) => {
                  const regionLabel = regions.find((r) => r.value === region)?.label
                  return (
                    <div key={region} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      {regionLabel}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <div className="flex justify-between mt-6">
            <Button type="button" variant="outline" onClick={prevStep}>
              Previous Step
            </Button>
            <Button type="button" onClick={nextStep} disabled={!isStepTwoValid()}>
              Next Step
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="step-3" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Review Your Information</CardTitle>
              <CardDescription>Please review your information before submitting your application.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium text-sm text-gray-500">Company Information</h3>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <p className="text-sm font-medium">Company Name</p>
                    <p className="text-sm">{formData.companyName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Website</p>
                    <p className="text-sm">{formData.website}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Contact Person</p>
                    <p className="text-sm">{formData.contactName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm">{formData.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm">{formData.phone}</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium text-sm text-gray-500">VM Offerings</h3>
                <div className="mt-2">
                  <p className="text-sm font-medium">Description</p>
                  <p className="text-sm mt-1">{formData.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-sm font-medium">VM Types</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {formData.vmTypes.map((type) => {
                        const typeLabel = vmTypes.find((t) => t.value === type)?.label
                        return (
                          <div key={type} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            {typeLabel}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Regions</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {formData.regions.map((region) => {
                        const regionLabel = regions.find((r) => r.value === region)?.label
                        return (
                          <div key={region} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            {regionLabel}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="termsAgreed"
              checked={formData.termsAgreed}
              onCheckedChange={handleCheckboxChange}
              className="mt-1"
            />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="termsAgreed"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Terms and Conditions
              </label>
              <p className="text-sm text-gray-500">
                I agree to the marketplace terms and conditions, including the provider agreement, commission structure,
                and content policies. I confirm that all information provided is accurate and complete.
              </p>
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <Button type="button" variant="outline" onClick={prevStep}>
              Previous Step
            </Button>
            <Button type="submit" disabled={isSubmitting || !isStepThreeValid()}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Application"
              )}
            </Button>
          </div>
        </TabsContent>
      </form>
    </Tabs>
  )
}

