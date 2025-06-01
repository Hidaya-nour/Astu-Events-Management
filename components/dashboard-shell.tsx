"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

interface DashboardShellProps {
  children: React.ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
     
      <AnimatePresence>
        {isLoaded && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="flex-1"
          >
            <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr] lg:grid-cols-[250px_1fr] py-8">
              <aside className="hidden w-[200px] flex-col md:flex lg:w-[250px]">
                <motion.nav
                  className="grid items-start gap-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                >
                  <DashboardNav />
                </motion.nav>
              </aside>
              <main className="flex w-full flex-1 flex-col overflow-hidden">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  {children}
                </motion.div>
              </main>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
     
    </div>
  )
}

function DashboardNav() {
  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: "layout-dashboard",
    },
    {
      title: "Events",
      href: "/dashboard/events",
      icon: "calendar",
    },
    {
      title: "Notifications",
      href: "/dashboard/notifications",
      icon: "bell",
    },
    {
      title: "Profile",
      href: "/dashboard/profile",
      icon: "user",
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: "settings",
    },
  ]

  return (
    <div className="flex flex-col gap-2">
      {navItems.map((item, index) => (
        <motion.div
          key={item.href}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 * index, duration: 0.5 }}
        >
          <a
            href={item.href}
            className="group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-primary-50 hover:text-primary-700 transition-all duration-200"
          >
            <span className="mr-2 h-4 w-4">{/* Icon would go here */}</span>
            <span>{item.title}</span>
          </a>
        </motion.div>
      ))}
    </div>
  )
}
