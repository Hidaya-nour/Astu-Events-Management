"use client"

import type React from "react"
import { type ReactNode, useState, useEffect } from "react"
import { Bell, Moon, Search, Sun, Home, CalendarCheck, Users, FileEdit, Download, Check, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { formatDistanceToNow } from "date-fns"

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
import { useDashboard } from "@/contexts/dashboard-context"

interface DashboardLayoutProps {
  children: ReactNode
  appName: string
  appLogo?: string
  helpText?: string
  helpLink?: string
}

interface Notification {
  id: string
  title: string
  message: string
  type: string
  read: boolean
  createdAt: string
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
  appName,
  appLogo,
  helpText = "Need Help?",
  helpLink = "#",
}: DashboardLayoutProps) {
  const [darkMode, setDarkMode] = useState(false)
  const { userInfo, sidebarItems, setActiveItem } = useDashboard()
  const pathname = usePathname()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (pathname) {
      setActiveItem(pathname)
    }
    fetchNotifications()
  }, [pathname])

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/notifications")
      if (response.ok) {
        const data = await response.json()
        setNotifications(data)
        setUnreadCount(data.filter((n: Notification) => !n.read).length)
      }
    } catch (error) {
      console.error("Error fetching notifications:", error)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch("/api/notifications", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      })

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        )
        setUnreadCount((prev) => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const response = await fetch("/api/notifications", {
        method: "PUT",
      })

      if (response.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
        setUnreadCount(0)
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
    }
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    // In a real implementation, you would toggle a class on the html/body element
    // or use a theme provider like next-themes
  }

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? "dark bg-gray-900" : "bg-gray-50"}`}>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
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
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[350px]">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <ScrollArea className="h-[300px]">
                <div className="space-y-2 p-2">
                  {notifications.length === 0 ? (
                    <div className="text-center text-sm text-muted-foreground py-4">
                      No notifications
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`flex items-start gap-4 rounded-lg p-2 ${
                          !notification.read ? "bg-muted" : ""
                        }`}
                      >
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <Bell className="h-4 w-4" />
                        </span>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {notification.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDistanceToNow(new Date(notification.createdAt), {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
              {notifications.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="justify-center text-sm"
                    onClick={markAllAsRead}
                  >
                    Mark all as read
                  </DropdownMenuItem>
                </>
              )}
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

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - fixed position */}
        <aside className="hidden w-64 border-r bg-background md:block dark:bg-gray-800 dark:border-gray-700">
          <div className="h-[calc(100vh-4rem)] sticky">
            <nav className="p-4 grid gap-2 text-sm">
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
          </div>
        </aside>

        {/* Main content - only this area scrolls */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-4 md:p-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
