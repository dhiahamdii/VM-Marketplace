"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { CreditCard, Calendar, Lock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface StripeCardElementProps {
  onChange: (isComplete: boolean, cardData: CardData) => void
}

export interface CardData {
  cardNumber: string
  cardholderName: string
  expiryMonth: string
  expiryYear: string
  cvc: string
}

export default function StripeCardElement({ onChange }: StripeCardElementProps) {
  const [cardData, setCardData] = useState<CardData>({
    cardNumber: "",
    cardholderName: "",
    expiryMonth: "",
    expiryYear: "",
    cvc: "",
  })
  const [cardType, setCardType] = useState<string | null>(null)
  const [isComplete, setIsComplete] = useState(false)

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

    if (/^4/.test(cleanNumber)) return "visa"
    if (/^5[1-5]/.test(cleanNumber)) return "mastercard"
    if (/^3[47]/.test(cleanNumber)) return "amex"
    if (/^6(?:011|5)/.test(cleanNumber)) return "discover"

    return null
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    // Format card number with spaces every 4 digits
    if (name === "cardNumber") {
      const formattedValue = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim()
        .slice(0, 19)

      setCardData({ ...cardData, [name]: formattedValue })
      setCardType(getCardType(formattedValue))
      return
    }

    setCardData({ ...cardData, [name]: value })
  }

  const handleSelectChange = (name: string, value: string) => {
    setCardData({ ...cardData, [name]: value })
  }

  // Check if form is complete
  useEffect(() => {
    const { cardNumber, cardholderName, expiryMonth, expiryYear, cvc } = cardData
    const isCardNumberValid = cardNumber.replace(/\s/g, "").length >= 15
    const isCardholderNameValid = cardholderName.trim().length > 0
    const isExpiryValid = expiryMonth && expiryYear
    const isCvcValid = cvc.length >= 3
    const formComplete = Boolean(isCardNumberValid && isCardholderNameValid && isExpiryValid && isCvcValid)
    setIsComplete(formComplete)
    onChange(formComplete, cardData)
  }, [cardData, onChange])

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="cardNumber">Card Number</Label>
        <div className="relative">
          <Input
            id="cardNumber"
            name="cardNumber"
            placeholder="1234 5678 9012 3456"
            value={cardData.cardNumber}
            onChange={handleInputChange}
            maxLength={19}
            className="pl-10"
            required
          />
          <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          {cardType && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm font-medium text-gray-500 capitalize">
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
          value={cardData.cardholderName}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Expiration Date</Label>
          <div className="flex space-x-2">
            <div className="relative w-full">
              <Select value={cardData.expiryMonth} onValueChange={(value) => handleSelectChange("expiryMonth", value)}>
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
              <Select value={cardData.expiryYear} onValueChange={(value) => handleSelectChange("expiryYear", value)}>
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
          <Label htmlFor="cvc">CVC</Label>
          <div className="relative">
            <Input
              id="cvc"
              name="cvc"
              placeholder="123"
              value={cardData.cvc}
              onChange={handleInputChange}
              maxLength={4}
              className="pl-10"
              required
            />
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  )
}
