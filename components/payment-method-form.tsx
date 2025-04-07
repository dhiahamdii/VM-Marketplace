"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CreditCard, Calendar, Lock, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function PaymentMethodForm({ onSuccess }: { onSuccess?: () => void }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardholderName: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    isDefault: true,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    // Format card number with spaces every 4 digits
    if (name === "cardNumber") {
      const formattedValue = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim()
        .slice(0, 19)

      setFormData({ ...formData, [name]: formattedValue })
      return
    }

    setFormData({ ...formData, [name]: value })
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData({ ...formData, isDefault: checked })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast({
      title: "Payment Method Added",
      description: "Your payment method has been added successfully.",
    })

    setIsSubmitting(false)

    // Reset form
    setFormData({
      cardNumber: "",
      cardholderName: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
      isDefault: true,
    })

    // Call success callback if provided
    if (onSuccess) {
      onSuccess()
    } else {
      router.push("/dashboard/billing")
    }
  }

  // Generate month options
  const months = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1
    return { value: month.toString().padStart(2, "0"), label: month.toString().padStart(2, "0") }
  })

  // Generate year options (current year + 20 years)
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 20 }, (_, i) => {
    const year = currentYear + i
    return { value: year.toString(), label: year.toString() }
  })

  // Determine card type based on first digits
  const getCardType = (number: string) => {
    const cleanNumber = number.replace(/\s/g, "")

    if (/^4/.test(cleanNumber)) return "Visa"
    if (/^5[1-5]/.test(cleanNumber)) return "Mastercard"
    if (/^3[47]/.test(cleanNumber)) return "American Express"
    if (/^6(?:011|5)/.test(cleanNumber)) return "Discover"

    return null
  }

  const cardType = getCardType(formData.cardNumber)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Payment Method</CardTitle>
        <CardDescription>Add a new credit or debit card to your account</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <div className="relative">
              <Input
                id="cardNumber"
                name="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={formData.cardNumber}
                onChange={handleInputChange}
                maxLength={19}
                className="pl-10"
                required
              />
              <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              {cardType && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm font-medium text-gray-500">
                  {cardType}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardholderName">Cardholder Name</Label>
            <Input
              id="cardholderName"
              name="cardholderName"
              placeholder="John Doe"
              value={formData.cardholderName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Expiration Date</Label>
              <div className="flex space-x-2">
                <div className="relative w-full">
                  <Select
                    value={formData.expiryMonth}
                    onValueChange={(value) => setFormData({ ...formData, expiryMonth: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="MM" />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((month) => (
                        <SelectItem key={month.value} value={month.value}>
                          {month.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
                <div className="w-full">
                  <Select
                    value={formData.expiryYear}
                    onValueChange={(value) => setFormData({ ...formData, expiryYear: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="YYYY" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year.value} value={year.value}>
                          {year.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <div className="relative">
                <Input
                  id="cvv"
                  name="cvv"
                  placeholder="123"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  maxLength={4}
                  className="pl-10"
                  required
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Checkbox id="isDefault" checked={formData.isDefault} onCheckedChange={handleCheckboxChange} />
            <Label htmlFor="isDefault" className="text-sm font-normal">
              Set as default payment method
            </Label>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Add Payment Method"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

