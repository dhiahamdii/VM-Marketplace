import type { Metadata } from "next"
import Link from "next/link"
import { Server, CreditCard, Activity, Settings, Plus, Clock, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import VMDashboardList from "@/components/vm-dashboard-list"
import VMUsageChart from "@/components/vm-usage-chart"

export const metadata: Metadata = {
  title: "Dashboard | VM Marketplace",
  description: "Manage your virtual machines",
}

export default function DashboardPage() {
  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-gray-500 mt-1">Manage your virtual machines and monitor usage</p>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/marketplace">
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                <span>Deploy New VM</span>
              </Button>
            </Link>

            <Link href="/dashboard/settings">
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
                <span className="sr-only">Settings</span>
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active VMs</CardTitle>
              <Server className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-gray-500">+1 from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Cost</CardTitle>
              <CreditCard className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$52.96</div>
              <p className="text-xs text-gray-500">+$12.99 from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Uptime</CardTitle>
              <Activity className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">99.9%</div>
              <p className="text-xs text-gray-500">Last 30 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Billing</CardTitle>
              <Clock className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15 Days</div>
              <p className="text-xs text-gray-500">Dec 15, 2023</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="vms" className="space-y-4">
          <TabsList>
            <TabsTrigger value="vms">My VMs</TabsTrigger>
            <TabsTrigger value="usage">Usage</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>

          <TabsContent value="vms" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Your Virtual Machines</h2>
              <Link href="/marketplace">
                <Button variant="outline" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  <span>Deploy New VM</span>
                </Button>
              </Link>
            </div>

            <VMDashboardList />
          </TabsContent>

          <TabsContent value="usage" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Resource Usage</h2>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  Last 7 Days
                </Button>
                <Button variant="outline" size="sm">
                  Last 30 Days
                </Button>
                <Button variant="outline" size="sm">
                  Custom Range
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>CPU Usage</CardTitle>
                  <CardDescription>Average CPU utilization across all VMs</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <VMUsageChart
                    data={[
                      { date: "Mon", value: 35 },
                      { date: "Tue", value: 42 },
                      { date: "Wed", value: 58 },
                      { date: "Thu", value: 45 },
                      { date: "Fri", value: 62 },
                      { date: "Sat", value: 40 },
                      { date: "Sun", value: 38 },
                    ]}
                    yAxisLabel="CPU %"
                    color="#3b82f6"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Memory Usage</CardTitle>
                  <CardDescription>Average memory utilization across all VMs</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <VMUsageChart
                    data={[
                      { date: "Mon", value: 48 },
                      { date: "Tue", value: 52 },
                      { date: "Wed", value: 65 },
                      { date: "Thu", value: 58 },
                      { date: "Fri", value: 72 },
                      { date: "Sat", value: 55 },
                      { date: "Sun", value: 50 },
                    ]}
                    yAxisLabel="Memory %"
                    color="#10b981"
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="billing" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Billing & Invoices</h2>
              <Button variant="outline">Download Statement</Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Current Billing Period</CardTitle>
                <CardDescription>Nov 15, 2023 - Dec 15, 2023</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="font-medium">Ubuntu 22.04 LTS (2 instances)</span>
                    <span>$11.98</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Windows Server 2022</span>
                    <span>$24.99</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Data Science Workbench</span>
                    <span>$12.99</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Additional Storage (200GB)</span>
                    <span>$3.00</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>$52.96</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <h3 className="text-lg font-medium mt-6">Recent Invoices</h3>
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
                      <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        <span>View</span>
                        <ArrowUpRight className="h-3 w-3" />
                      </Button>
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
                      <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        <span>View</span>
                        <ArrowUpRight className="h-3 w-3" />
                      </Button>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">INV-2023-09</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Sep 15, 2023</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$26.98</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Paid
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        <span>View</span>
                        <ArrowUpRight className="h-3 w-3" />
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

