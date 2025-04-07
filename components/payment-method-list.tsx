"use client"

import { useState } from "react"
import Link from "next/link"
import { CreditCard, MoreHorizontal, Plus, Trash2, CheckCircle, Edit, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

// Sample payment methods data
const samplePaymentMethods = [
  {
    id: 1,
    type: "credit_card",
    brand: "Visa",
    last4: "4242",
    expMonth: "12",
    expYear: "2025",
    cardholderName: "John Doe",
    isDefault: true,
  },
  {
    id: 2,
    type: "credit_card",
    brand: "Mastercard",
    last4: "5678",
    expMonth: "08",
    expYear: "2024",
    cardholderName: "John Doe",
    isDefault: false,
  },
]

export default function PaymentMethodsList() {
  const { toast } = useToast()
  const [paymentMethods, setPaymentMethods] = useState(samplePaymentMethods)
  const [selectedMethod, setSelectedMethod] = useState<(typeof samplePaymentMethods)[0] | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSettingDefault, setIsSettingDefault] = useState<number | null>(null)

  const handleDelete = async () => {
    if (!selectedMethod) return

    setIsDeleting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setPaymentMethods(paymentMethods.filter((method) => method.id !== selectedMethod.id))
    setIsDeleting(false)
    setShowDeleteDialog(false)

    toast({
      title: "Payment Method Removed",
      description: `Your ${selectedMethod.brand} ending in ${selectedMethod.last4} has been removed.`,
    })
  }

  const handleSetDefault = async (id: number) => {
    setIsSettingDefault(id)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setPaymentMethods(
      paymentMethods.map((method) => ({
        ...method,
        isDefault: method.id === id,
      })),
    )

    setIsSettingDefault(null)

    toast({
      title: "Default Payment Method Updated",
      description: "Your default payment method has been updated successfully.",
    })
  }

  const getCardIcon = (brand: string) => {
    // In a real app, you would use specific card brand icons
    return <CreditCard className="h-5 w-5" />
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Payment Methods</h2>
        <Link href="/dashboard/billing/add-payment-method">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>Add Payment Method</span>
          </Button>
        </Link>
      </div>

      {paymentMethods.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10 text-center">
            <CreditCard className="h-10 w-10 text-gray-400 mb-4" />
            <CardTitle className="text-xl mb-2">No Payment Methods</CardTitle>
            <CardDescription className="mb-6">
              You haven't added any payment methods to your account yet.
            </CardDescription>
            <Link href="/dashboard/billing/add-payment-method">
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                <span>Add Payment Method</span>
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paymentMethods.map((method) => (
            <Card key={method.id} className="relative">
              {method.isDefault && (
                <Badge className="absolute top-2 right-2 bg-green-100 text-green-800 hover:bg-green-100">Default</Badge>
              )}
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getCardIcon(method.brand)}
                    <CardTitle className="text-lg">{method.brand}</CardTitle>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {!method.isDefault && (
                        <DropdownMenuItem
                          onClick={() => handleSetDefault(method.id)}
                          disabled={isSettingDefault === method.id}
                        >
                          {isSettingDefault === method.id ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Setting default...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Set as default
                            </>
                          )}
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem>
                        <Link
                          href={`/dashboard/billing/edit-payment-method/${method.id}`}
                          className="flex items-center w-full"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedMethod(method)
                          setShowDeleteDialog(true)
                        }}
                        className="text-red-600 focus:text-red-600"
                        disabled={method.isDefault}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <div className="text-sm font-medium">•••• •••• •••• {method.last4}</div>
                  <div className="text-sm text-gray-500">
                    Expires {method.expMonth}/{method.expYear.slice(-2)}
                  </div>
                  <div className="text-sm text-gray-500">{method.cardholderName}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Payment Method</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this payment method? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedMethod && (
            <div className="flex items-center gap-3 p-3 border rounded-md bg-gray-50">
              {getCardIcon(selectedMethod.brand)}
              <div>
                <div className="font-medium">
                  {selectedMethod.brand} •••• {selectedMethod.last4}
                </div>
                <div className="text-sm text-gray-500">
                  Expires {selectedMethod.expMonth}/{selectedMethod.expYear.slice(-2)}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Removing...
                </>
              ) : (
                "Remove"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

