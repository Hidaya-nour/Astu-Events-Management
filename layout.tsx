import type React from "react"
import type { Viewport } from "next"
import { Inter } from "next/font/google"

import { ThemeProvider } from "@/components/theme-provider"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "ASTU University Events",
  description:
    "Discover academic conferences, cultural celebrations, workshops, and more at Adama Science and Technology University.",
    generator: 'v0.dev'
}

export const viewport: Viewport = {
  themeColor: "#0047AB", // ASTU Blue
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <div className="relative flex min-h-screen flex-col">
            <SiteHeader />
            {children}
            <SiteFooter />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
