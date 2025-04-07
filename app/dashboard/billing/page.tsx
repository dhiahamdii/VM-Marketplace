import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PaymentMethodsList from "@/components/payment-method-list"

export const metadata: Metadata = {
  title: "Billing & Payment Methods | VM Marketplace",
  description: "Manage your billing information and payment methods",
}

export default function BillingPage() {
  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-800">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Billing & Payments</h1>
        </div>

        <Tabs defaultValue="payment-methods" className="space-y-4">
          <TabsList>
            <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="billing-address">Billing Address</TabsTrigger>
          </TabsList>

          <TabsContent value="payment-methods" className="space-y-4">
            <PaymentMethodsList />
          </TabsContent>

          <TabsContent value="invoices" className="space-y-4">
            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Invoice
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">INV-2023-11</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Nov 15, 2023</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$39.97</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Paid
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href="/dashboard/billing/invoices/INV-2023-11"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">INV-2023-10</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Oct 15, 2023</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$39.97</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Paid
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href="/dashboard/billing/invoices/INV-2023-10"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="billing-address" className="space-y-4">
            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-medium mb-4">Billing Address</h3>
              <div className="space-y-2">
                <p>John Doe</p>
                <p>123 Main Street</p>
                <p>Apt 4B</p>
                <p>New York, NY 10001</p>
                <p>United States</p>
              </div>
              <div className="mt-4">
                <Link href="/dashboard/billing/edit-address">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Edit Address</button>
                </Link>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

