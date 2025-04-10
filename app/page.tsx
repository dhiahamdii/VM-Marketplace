import Link from "next/link"
import { ArrowRight, Cloud, Server, Shield, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import FeaturedVMs from "@/components/featured-vms"
import SiteHeader from "@/components/site-header"
import Image from "next/image";
export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />

      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                VM Marketplace
              </h1>
     
              <p className="mx-auto max-w-[700px] text-gray-300 md:text-xl">
                Deploy virtual machines in seconds. Choose from thousands of pre-configured VMs.
                 {/* or create your own. */}
              </p>
            </div>
            <div className="space-x-4">
              <Link href="/marketplace">
                <Button className="bg-white text-gray-900 hover:bg-gray-200">
                  Browse Marketplace
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              {/* <Link href="/providers/register">
                <Button variant="outline" className="border-white text-white hover:bg-white/10">
                  Become a Provider
                </Button>
              </Link> */}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Why Choose Our VM Marketplace
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                Our platform offers a seamless experience for both VM providers and customers.
              </p>
            </div>
          </div>
    {/* Changed grid-cols-3 to grid-cols-2 for lg breakpoint */}
    <div className="grid grid-cols-1 gap-6 mt-12 md:grid-cols-2 lg:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Zap className="h-8 w-8 text-blue-500" />
          <CardTitle>Instant Deployment</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            Deploy your virtual machines in seconds with our automated provisioning system.
          </CardDescription>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Server className="h-8 w-8 text-green-500" />
          <CardTitle>Wide Selection</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            Choose from thousands of pre-configured VMs for every use case and budget.
          </CardDescription>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Shield className="h-8 w-8 text-red-500" />
          <CardTitle>Secure & Reliable</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            All VMs are scanned for vulnerabilities and backed by our uptime guarantee.
          </CardDescription>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Cloud className="h-8 w-8 text-purple-500" />
          <CardTitle>Multi-Cloud Support</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            Deploy to AWS, Azure, GCP, or your own infrastructure with a single click.
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  </div>
</section>

      {/* Featured VMs Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Featured Virtual Machines</h2>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                Explore our most popular and highly-rated virtual machines.
              </p>
            </div>
          </div>
          <FeaturedVMs />
          <div className="flex justify-center mt-8">
            <Link href="/marketplace">
              <Button>
                View All VMs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-900 text-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Ready to Get Started?</h2>
              <p className="mx-auto max-w-[700px] text-gray-300 md:text-xl">
                Join thousands of users who trust our marketplace for their VM needs.
              </p>
            </div>
            <div className="space-x-4">
              <Link href="/auth/register">
                <Button className="bg-white text-gray-900 hover:bg-gray-200">Sign Up Now</Button>
              </Link>
              <Link href="/marketplace">
                <Button variant="outline" className="bg-white text-gray-900 hover:bg-gray-200">
                  Explore Marketplace
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

