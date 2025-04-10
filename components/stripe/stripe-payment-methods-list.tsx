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
import { useStripe } from "@/components/stripe/stripe-provider"
import type { PaymentMethod } from "@/types/stripe"

export default function StripePaymentMethodsList() {
  const { toast } = useToast()
  const { paymentMethods, loading, removePaymentMethod, setDefaultPaymentMethod } = useStripe()
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSettingDefault, setIsSettingDefault] = useState<string | null>(null)

  const handleDelete = async () => {
    if (!selectedMethod) return

    setIsDeleting(true)

    try {
      await removePaymentMethod(selectedMethod)

      toast({
        title: "Payment Method Removed",
        description: "Your payment method has been removed successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to remove payment method",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
      setSelectedMethod(null)
    }
  }

  const handleSetDefault = async (id: string) => {
    setIsSettingDefault(id)

    try {
      await setDefaultPaymentMethod(id)

      toast({
        title: "Default Payment Method Updated",
        description: "Your default payment method has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update default payment method",
        variant: "destructive",
      })
    } finally {
      setIsSettingDefault(null)
    }
  }

  const getCardIcon = (brand: string) => {
    // In a real app, you would use specific card brand icons
    return <CreditCard className="h-5 w-5" />
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
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
              {method.metadata?.isDefault === "true" && (
                <Badge className="absolute top-2 right-2 bg-green-100 text-green-800 hover:bg-green-100">Default</Badge>
              )}
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {method.card && getCardIcon(method.card.brand)}
                    {method.card && (
                      <CardTitle className="text-lg capitalize">{method.card.brand}</CardTitle>
                    )}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {method.metadata?.isDefault !== "true" && (
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
                          setSelectedMethod(method.id)
                          setShowDeleteDialog(true)
                        }}
                        className="text-red-600 focus:text-red-600"
                        disabled={method.metadata?.isDefault === "true"}
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
                  {method.card && (
                    <>
                      <div className="text-sm font-medium">•••• •••• •••• {method.card.last4}</div>
                      <div className="text-sm text-gray-500">
                        Expires {method.card.exp_month.toString().padStart(2, "0")}/
                        {method.card.exp_year.toString().slice(-2)}
                      </div>
                    </>
                  )}
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
          {selectedMethod && paymentMethods.find((method) => method.id === selectedMethod)?.card && (
            <div className="flex items-center gap-3 p-3 border rounded-md bg-gray-50">
              {getCardIcon(paymentMethods.find((method) => method.id === selectedMethod)!.card!.brand)}
              <div>
                <div className="font-medium capitalize">
                  {paymentMethods.find((method) => method.id === selectedMethod)!.card!.brand} ••••{" "}
                  {paymentMethods.find((method) => method.id === selectedMethod)!.card!.last4}
                </div>
                <div className="text-sm text-gray-500">
                  Expires{" "}
                  {paymentMethods
                    .find((method) => method.id === selectedMethod)!
                    .card!.exp_month.toString()
                    .padStart(2, "0")}
                  /
                  {paymentMethods
                    .find((method) => method.id === selectedMethod)!
                    .card!.exp_year.toString()
                    .slice(-2)}
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
