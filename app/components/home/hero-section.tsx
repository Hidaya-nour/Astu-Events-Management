import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative">
      {/* Background Image */}
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center brightness-[0.4] z-0" />

      <div className="container relative z-10 py-24 md:py-32 lg:py-40 flex flex-col items-center text-center">
        <div className="space-y-6 max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-white">
            Create Unforgettable Events with Ease
          </h1>
          <p className="mx-auto max-w-[700px] text-lg text-gray-200 md:text-xl">
            Your all-in-one platform for planning, organizing, and managing successful events of any size
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/get-started">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-background/20 hover:bg-background/30 text-white border-white/20"
              asChild
            >
              <Link href="/demo">Request a Demo</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
