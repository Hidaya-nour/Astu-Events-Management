"use client"

import type React from "react"
import { type ReactNode, useState } from "react"
import { Bell, Moon, Search, Sun, Home, CalendarCheck, Users, FileEdit, Download } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

interface DashboardLayoutProps {
  children: ReactNode
  sidebarItems: {
    icon: string
    title: string
    href: string
    isActive?: boolean
  }[]
  userInfo: {
    name: string
    role: string
    avatar?: string
    initials?: string
    additionalInfo?: {
      label: string
      value: string
      icon?: React.ElementType
    }[]
    badges?: {
      label: string
      icon?: React.ElementType
    }[]
  }
  appName: string
  appLogo?: string
  helpText?: string
  helpLink?: string
}

const iconMap: Record<string, React.ComponentType<any>> = {
  "home": Home,
  "calendar-check": CalendarCheck,
  "users": Users,
  "file-edit": FileEdit,
  "download": Download,
  // ...add more as needed
};

export function DashboardLayout({
  children,
  sidebarItems,
  userInfo,
  appName,
  appLogo,
  helpText = "Need Help?",
  helpLink = "#",
}: DashboardLayoutProps) {
  const [darkMode, setDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    // In a real implementation, you would toggle a class on the html/body element
    // or use a theme provider like next-themes
  }

  return (
    <div className={`min-h-screen ${darkMode ? "dark bg-gray-900" : "bg-gray-50"}`}>
      {/* Header */}
      <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-background px-4 md:px-6 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center gap-2 font-semibold">
          {appLogo ? (
            <Image src={appLogo} width={32} height={32} alt={appName} className="rounded" />
          ) : (
            <div className="h-8 w-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold">
              {(appName || "A").charAt(0)}
            </div>
          )}
          <span className="hidden md:inline-block">{appName}</span>
        </div>

        <div className="ml-auto flex items-center gap-4">
          <div className="relative hidden md:block">
            <Input 
              type="search" 
              placeholder="Search..." 
              className="w-[200px] md:w-[300px] pl-8" 
            />
            <Search className="absolute left-2.5  h-4 w-4 text-muted-foreground" />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                  3
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[350px]">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <ScrollArea className="h-[300px]">
                <div className="space-y-2 p-2">
                  {/* Notification items would go here */}
                  <div className="flex items-start gap-4 rounded-lg p-2 hover:bg-muted">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Bell className="h-4 w-4" />
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New notification</p>
                      <p className="text-xs text-muted-foreground">This is a sample notification message</p>
                      <p className="text-xs text-muted-foreground mt-1">24 minutes ago</p>
                    </div>
                  </div>
                </div>
              </ScrollArea>
              <DropdownMenuSeparator />
              <div className="p-2">
                <Button variant="outline" size="sm" className="w-full">
                  View all notifications
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" size="icon" onClick={toggleDarkMode}>
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={userInfo?.avatar || ""} alt={userInfo?.name || "User"} />
                  <AvatarFallback>{userInfo?.initials || userInfo?.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Help & Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden w-64 flex-col border-r bg-background p-4 md:flex dark:bg-gray-800 dark:border-gray-700">
          <nav className="grid gap-2 text-sm">
            {sidebarItems.map((item, index) => {
              const Icon = iconMap[item.icon] || Home;
              return (
                <Link
                  key={index}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-all ${
                    item.isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.title}
                </Link>
              );
            })}
            {helpText && (
              <>
                <div className="my-2 h-[1px] w-full bg-border dark:bg-gray-700" />
                <div className="rounded-lg border bg-card p-3 text-card-foreground shadow-sm dark:border-gray-700">
                  <h3 className="mb-1 font-medium">{helpText}</h3>
                  <p className="text-xs text-muted-foreground">Contact our support team for assistance.</p>
                  <Button variant="link" size="sm" className="mt-2 h-auto p-0 text-xs" asChild>
                    <Link href={helpLink}>Contact Support</Link>
                  </Button>
                </div>
              </>
            )}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-4 md:p-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
