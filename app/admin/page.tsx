"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import {
  Users,
  Calendar,
  Building2,
  FileText,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

interface Stats {
  totalUsers: number
  totalEvents: number
  totalOrganizations: number
  pendingApprovals: number
  recentActivity?: {
    events: Array<{
      id: string
      title: string
      approvalStatus: string
      createdAt: string
      organizer: {
        name: string
      }
    }>
    users: Array<{
      id: string
      name: string
      email: string
      createdAt: string
    }>
    organizations: Array<{
      id: string
      name: string
      email: string
      createdAt: string
    }>
  }
}

const ITEMS_PER_PAGE = 5

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalEvents: 0,
    totalOrganizations: 0,
    pendingApprovals: 0,
    recentActivity: {
      events: [],
      users: [],
      organizations: []
    }
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [activeTab, setActiveTab] = useState("all")
  const { data: session, status } = useSession()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats')
        if (!response.ok) {
          const errorData = await response.json().catch(() => null)
          throw new Error(errorData?.details || `Failed to fetch stats: ${response.status}`)
        }
        const data = await response.json()
        setStats(data)
      } catch (err) {
        console.error("Error fetching stats:", err)
        setError(err instanceof Error ? err.message : 'An error occurred while fetching recent activity')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const getCurrentItems = () => {
    if (!stats.recentActivity) return []
    
    let items = []
    if (activeTab === "all") {
      items = [
        ...stats.recentActivity.events.map(event => ({ ...event, type: 'event' })),
        ...stats.recentActivity.users.map(user => ({ ...user, type: 'user' })),
        ...stats.recentActivity.organizations.map(org => ({ ...org, type: 'organization' }))
      ]
    } else if (activeTab === "events") {
      items = stats.recentActivity.events.map(event => ({ ...event, type: 'event' }))
    } else if (activeTab === "users") {
      items = stats.recentActivity.users.map(user => ({ ...user, type: 'user' }))
    } else if (activeTab === "organizers") {
      items = stats.recentActivity.organizations.map(org => ({ ...org, type: 'organization' }))
    }

    // Sort by createdAt in descending order
    items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    return items.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }

  const totalPages = () => {
    if (!stats.recentActivity) return 1
    
    let totalItems = 0
    if (activeTab === "all") {
      totalItems = stats.recentActivity.events.length + 
                  stats.recentActivity.users.length + 
                  stats.recentActivity.organizations.length
    } else if (activeTab === "events") {
      totalItems = stats.recentActivity.events.length
    } else if (activeTab === "users") {
      totalItems = stats.recentActivity.users.length
    } else if (activeTab === "organizers") {
      totalItems = stats.recentActivity.organizations.length
    }

    return Math.ceil(totalItems / ITEMS_PER_PAGE)
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    setCurrentPage(1) // Reset to first page when changing tabs
  }

  if (status === "loading" || loading) {
    return (
      <DashboardLayout appName="ASTU Events">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      appName="ASTU Events"
      appLogo="/placeholder.svg?height=32&width=32"
      helpText="Need Assistance?"
      helpLink="/dashboard/admin/support"
    >
      <div className="container mx-auto p-4 md:p-6 space-y-8">
        {/* Welcome Section */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Welcome, {session?.user?.name}</h1>
              <p className="text-muted-foreground">System Administrator</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                <Clock className="mr-1 inline-block h-4 w-4" />
                Last login: {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">Registered students</p>
              <Progress 
                value={(stats.totalUsers / 1000) * 100} 
                className="mt-2 h-1" 
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEvents}</div>
              <p className="text-xs text-muted-foreground">Active events</p>
              <Progress 
                value={(stats.totalEvents / 100) * 100} 
                className="mt-2 h-1" 
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Organizers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrganizations}</div>
              <p className="text-xs text-muted-foreground">Registered organizers</p>
              <Progress 
                value={(stats.totalOrganizations / 50) * 100} 
                className="mt-2 h-1" 
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingApprovals}</div>
              <p className="text-xs text-muted-foreground">Require attention</p>
              <Progress 
                value={(stats.pendingApprovals / 20) * 100} 
                className="mt-2 h-1" 
              />
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          {error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              <Tabs defaultValue="all" onValueChange={handleTabChange}>
                <TabsList className="mb-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="events">Events</TabsTrigger>
                  <TabsTrigger value="users">Users</TabsTrigger>
                  <TabsTrigger value="organizers">Organizers</TabsTrigger>
                </TabsList>
                <div className="space-y-4">
                  {getCurrentItems().map((item) => (
                    <Alert key={item.id}>
                      {item.type === 'event' ? (
                        <>
                          {item.approvalStatus === "PENDING" ? (
                            <AlertCircle className="h-4 w-4" />
                          ) : item.approvalStatus === "APPROVED" ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <XCircle className="h-4 w-4" />
                          )}
                          <AlertTitle>
                            {item.approvalStatus === "PENDING" ? "New Event Request" :
                             item.approvalStatus === "APPROVED" ? "Event Approved" :
                             "Event Rejected"}
                          </AlertTitle>
                          <AlertDescription>
                            {item.title} by {item.organizer.name}
                          </AlertDescription>
                        </>
                      ) : item.type === 'user' ? (
                        <>
                          <CheckCircle2 className="h-4 w-4" />
                          <AlertTitle>New User Registration</AlertTitle>
                          <AlertDescription>
                            {item.name} ({item.email})
                          </AlertDescription>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>New Organizer Registration</AlertTitle>
                          <AlertDescription>
                            {item.name} ({item.email})
                          </AlertDescription>
                        </>
                      )}
                    </Alert>
                  ))}
                </div>
              </Tabs>

              {/* Pagination Controls */}
              <div className="flex items-center justify-between mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages()}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages()}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
} 