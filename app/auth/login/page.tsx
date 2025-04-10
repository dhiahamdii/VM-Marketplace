import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import LoginForm from "@/components/auth/login-form"

export const metadata: Metadata = {
  title: "Login | VM Marketplace",
  description: "Login to your VM Marketplace account",
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:block relative w-1/2 bg-gray-900">
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="max-w-md text-white space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Welcome back to VM Marketplace</h1>
              <p className="text-gray-300">
                Access your virtual machines, manage deployments, and monitor usage all in one place.
              </p>
            </div>

            <div className="bg-gray-800/50 p-6 rounded-lg space-y-4">
              <div className="flex items-start gap-4">
                <div className="bg-blue-500/20 p-2 rounded-full">
                  <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Deploy in seconds</h3>
                  <p className="text-sm text-gray-400">Launch new VMs with just a few clicks</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-green-500/20 p-2 rounded-full">
                  <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Secure infrastructure</h3>
                  <p className="text-sm text-gray-400">Enterprise-grade security for all your VMs</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-purple-500/20 p-2 rounded-full">
                  <svg className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">24/7 monitoring</h3>
                  <p className="text-sm text-gray-400">Real-time insights and alerts for your VMs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col p-8">
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>

          <Link href="/" className="flex items-center">
            <Image   src="/vm-huawei-logo.png"
  alt="VM Marketplace Logo" width={40} height={40} />
            <span className="ml-2 font-bold text-xl">VM Marketplace</span>
          </Link>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}

