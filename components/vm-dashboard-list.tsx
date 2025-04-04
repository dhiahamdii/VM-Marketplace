"use client"

import { useState } from "react"
import Link from "next/link"
import {
  MoreHorizontal,
  Play,
  Square,
  RefreshCw,
  Trash2,
  Terminal,
  HardDrive,
  Server,
  MemoryStickIcon as Memory,
  Globe,
  AlertTriangle,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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

// Sample VM data
const myVMs = [
  {
    id: 1,
    name: "web-server-prod",
    image: "Ubuntu 22.04 LTS",
    status: "running",
    uptime: "15 days, 7 hours",
    region: "US East",
    ip: "203.0.113.10",
    specs: {
      cpu: "2 vCPU",
      ram: "4 GB",
      storage: "80 GB SSD",
      usage: {
        cpu: 42,
        ram: 65,
        disk: 38,
      },
    },
  },
  {
    id: 2,
    name: "db-server-prod",
    image: "Ubuntu 22.04 LTS",
    status: "running",
    uptime: "15 days, 6 hours",
    region: "US East",
    ip: "203.0.113.11",
    specs: {
      cpu: "4 vCPU",
      ram: "16 GB",
      storage: "250 GB SSD",
      usage: {
        cpu: 58,
        ram: 72,
        disk: 45,
      },
    },
  },
  {
    id: 3,
    name: "data-science-dev",
    image: "Data Science Workbench",
    status: "stopped",
    uptime: "0 days, 0 hours",
    region: "US West",
    ip: "203.0.113.12",
    specs: {
      cpu: "8 vCPU",
      ram: "32 GB",
      storage: "500 GB SSD",
      usage: {
        cpu: 0,
        ram: 0,
        disk: 22,
      },
    },
  },
  {
    id: 4,
    name: "windows-server",
    image: "Windows Server 2022",
    status: "running",
    uptime: "7 days, 12 hours",
    region: "EU Central",
    ip: "203.0.113.13",
    specs: {
      cpu: "4 vCPU",
      ram: "16 GB",
      storage: "250 GB SSD",
      usage: {
        cpu: 35,
        ram: 48,
        disk: 52,
      },
    },
  },
]

export default function VMDashboardList() {
  const { toast } = useToast()
  const [vms, setVMs] = useState(myVMs)
  const [selectedVM, setSelectedVM] = useState<(typeof myVMs)[0] | null>(null)
  const [isRestarting, setIsRestarting] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleStart = (id: number) => {
    setVMs(vms.map((vm) => (vm.id === id ? { ...vm, status: "running", uptime: "0 days, 0 hours" } : vm)))

    toast({
      title: "VM Started",
      description: `VM ${vms.find((vm) => vm.id === id)?.name} has been started successfully.`,
    })
  }

  const handleStop = (id: number) => {
    setVMs(vms.map((vm) => (vm.id === id ? { ...vm, status: "stopped", uptime: "0 days, 0 hours" } : vm)))

    toast({
      title: "VM Stopped",
      description: `VM ${vms.find((vm) => vm.id === id)?.name} has been stopped successfully.`,
    })
  }

  const handleRestart = (id: number) => {
    setIsRestarting(id)

    // Simulate restart process
    setTimeout(() => {
      setVMs(vms.map((vm) => (vm.id === id ? { ...vm, status: "running", uptime: "0 days, 0 hours" } : vm)))

      setIsRestarting(null)

      toast({
        title: "VM Restarted",
        description: `VM ${vms.find((vm) => vm.id === id)?.name} has been restarted successfully.`,
      })
    }, 3000)
  }

  const handleDelete = () => {
    if (!selectedVM) return

    setIsDeleting(true)

    // Simulate delete process
    setTimeout(() => {
      setVMs(vms.filter((vm) => vm.id !== selectedVM.id))

      setIsDeleting(false)
      setShowDeleteDialog(false)

      toast({
        title: "VM Deleted",
        description: `VM ${selectedVM.name} has been deleted successfully.`,
      })
    }, 2000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "bg-green-500"
      case "stopped":
        return "bg-gray-500"
      case "restarting":
        return "bg-yellow-500"
      case "error":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "running":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Running</Badge>
      case "stopped":
        return (
          <Badge variant="outline" className="text-gray-500 hover:bg-gray-100">
            Stopped
          </Badge>
        )
      case "restarting":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Restarting</Badge>
      case "error":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Error</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name / Image
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specs</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Region / IP
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {vms.map((vm) => (
            <tr key={vm.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col">
                  <div className="text-sm font-medium text-gray-900">{vm.name}</div>
                  <div className="text-sm text-gray-500">{vm.image}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <div className={`h-2.5 w-2.5 rounded-full mr-2 ${getStatusColor(vm.status)}`}></div>
                    {getStatusBadge(vm.status)}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {vm.status === "running" ? `Uptime: ${vm.uptime}` : ""}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col text-sm text-gray-500">
                  <div className="flex items-center">
                    <Server className="h-3.5 w-3.5 mr-1 text-gray-400" />
                    <span>{vm.specs.cpu}</span>
                  </div>
                  <div className="flex items-center">
                    <Memory className="h-3.5 w-3.5 mr-1 text-gray-400" />
                    <span>{vm.specs.ram}</span>
                  </div>
                  <div className="flex items-center">
                    <HardDrive className="h-3.5 w-3.5 mr-1 text-gray-400" />
                    <span>{vm.specs.storage}</span>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-col space-y-2 w-36">
                  <div className="flex items-center justify-between text-xs">
                    <span>CPU</span>
                    <span>{vm.specs.usage.cpu}%</span>
                  </div>
                  <Progress value={vm.specs.usage.cpu} className="h-1.5" />

                  <div className="flex items-center justify-between text-xs">
                    <span>RAM</span>
                    <span>{vm.specs.usage.ram}%</span>
                  </div>
                  <Progress value={vm.specs.usage.ram} className="h-1.5" />

                  <div className="flex items-center justify-between text-xs">
                    <span>Disk</span>
                    <span>{vm.specs.usage.disk}%</span>
                  </div>
                  <Progress value={vm.specs.usage.disk} className="h-1.5" />
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col text-sm text-gray-500">
                  <div className="flex items-center">
                    <Globe className="h-3.5 w-3.5 mr-1 text-gray-400" />
                    <span>{vm.region}</span>
                  </div>
                  <div className="text-sm font-mono mt-1">{vm.ip}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end space-x-2">
                  {vm.status === "running" ? (
                    <Button variant="outline" size="sm" onClick={() => handleStop(vm.id)} className="h-8 px-2">
                      <Square className="h-4 w-4" />
                      <span className="sr-only">Stop</span>
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => handleStart(vm.id)} className="h-8 px-2">
                      <Play className="h-4 w-4" />
                      <span className="sr-only">Start</span>
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRestart(vm.id)}
                    disabled={isRestarting === vm.id || vm.status === "stopped"}
                    className="h-8 px-2"
                  >
                    {isRestarting === vm.id ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                    <span className="sr-only">Restart</span>
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">More</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>VM Actions</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <Link href={`/dashboard/vm/${vm.id}`} className="flex items-center w-full">
                          <Server className="h-4 w-4 mr-2" />
                          <span>View Details</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Terminal className="h-4 w-4 mr-2" />
                        <span>SSH Console</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedVM(vm)
                          setShowDeleteDialog(true)
                        }}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Virtual Machine</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the VM "{selectedVM?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
            <div className="text-sm text-amber-800">
              <p className="font-medium">Warning</p>
              <p>
                Deleting this VM will permanently remove all associated data, including storage volumes and IP
                addresses.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>Delete VM</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

