import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import CustomVMBuilder from "@/components/custom-vm-builder"

export const metadata: Metadata = {
  title: "Build Custom VM | VM Marketplace",
  description: "Create a custom virtual machine with your preferred specifications",
}

export default function CustomVMPage() {
  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center gap-2">
          <Link href="/marketplace" className="text-blue-600 hover:text-blue-800">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Build Your Custom VM</h1>
        </div>

        <p className="text-gray-500 max-w-3xl">
          Design your perfect virtual machine by selecting the specifications that meet your exact requirements. Our
          custom VM builder allows you to choose CPU, memory, storage, and operating system options.
        </p>

        <Separator />

        <CustomVMBuilder />
      </div>
    </div>
  )
}
