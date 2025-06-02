"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Download,
  Trash,
  Edit,
  UserPlus,
  UserCheck,
  UserX,
  Eye,
  X,
  XCircle,
} from "lucide-react"
import { AddUserForm } from "@/components/admin/add-user-form"
import { UserDetailModal } from "@/components/admin/user-detail-modal"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import debounce from "lodash/debounce"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export default function UserManagementPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  // States
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    activeUsers: 0,
    newUsers: 0,
    inactiveUsers: 0,
    verifiedUsers: 0,
    departmentStats: [],
    roleStats: [],
  })
  
  // Pagination and filters
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [search, setSearch] = useState("")
  const [role, setRole] = useState("")
  const [department, setDepartment] = useState("")
  const [sortBy, setSortBy] = useState("createdAt")
  const [sortOrder, setSortOrder] = useState("desc")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filterData, setFilterData] = useState({
    role: "",
    department: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearch(value)
    }, 300),
    []
  )

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    e.target.value = value // Update input value immediately
    debouncedSearch(value) // Debounce the actual search
  }

  // Check authentication
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    } else if (session?.user?.role !== "ADMIN") {
      // router.push("/dashboard")
    }
  }, [session, status, router])

  // Fetch users with better error handling
  const fetchUsers = async () => {
    try {
      setError(null)
      setIsLoading(true)
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
        ...(filterData.role && { role: filterData.role }),
        ...(filterData.department && { department: filterData.department }),
        sortBy: filterData.sortBy,
        sortOrder: filterData.sortOrder,
      })

      const response = await fetch(`/api/admin/users?${queryParams}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch users")
      }
      
      setUsers(data.users || [])
      setStats({
        total: data.total || 0,
        activeUsers: data.roleStats?.find(s => s.role === "ACTIVE")?._count || 0,
        newUsers: (data.users || []).filter(u => {
          const createdAt = new Date(u.createdAt)
          const thirtyDaysAgo = new Date()
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
          return createdAt > thirtyDaysAgo
        }).length,
        inactiveUsers: data.roleStats?.find(s => s.role === "INACTIVE")?._count || 0,
        verifiedUsers: (data.users || []).filter(u => u.emailVerified).length,
        departmentStats: data.departmentStats || [],
        roleStats: data.roleStats || [],
      })
    } catch (error) {
      console.error("Error fetching users:", error)
      setError(error.message || "Failed to fetch users")
      toast.error(error.message || "Failed to fetch users")
      // Reset data on error
      setUsers([])
      setStats({
        total: 0,
        activeUsers: 0,
        newUsers: 0,
        inactiveUsers: 0,
        verifiedUsers: 0,
        departmentStats: [],
        roleStats: [],
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (session?.user?.role === "ADMIN") {
      fetchUsers()
    }
  }, [page, search, filterData, session])

  // Handle user update
  const handleUserUpdate = async (userId, updateData) => {
    try {
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, ...updateData }),
      })

      if (!response.ok) throw new Error("Failed to update user")
      
      toast.success("User updated successfully")
      fetchUsers()
    } catch (error) {
      console.error("Error updating user:", error)
      toast.error("Failed to update user")
    }
  }

  // Handle user deletion
  const handleUserDelete = async (userId) => {
    try {
      const response = await fetch(`/api/admin/users?id=${userId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete user")
      
      toast.success("User deleted successfully")
      fetchUsers()
    } catch (error) {
      console.error("Error deleting user:", error)
      toast.error("Failed to delete user")
    }
  }

  // Modal handlers
  const openAddUserForm = () => setIsAddUserOpen(true)
  const closeAddUserForm = () => setIsAddUserOpen(false)
  const openUserDetail = (user) => setSelectedUser(user)
  const closeUserDetail = () => setSelectedUser(null)

  // Filter handlers
  const handleFilterChange = (key: string, value: string) => {
    setFilterData(prev => ({ ...prev, [key]: value }))
  }

  const resetFilters = () => {
    setFilterData({
      role: "",
      department: "",
      sortBy: "createdAt",
      sortOrder: "desc",
    })
    setIsFilterOpen(false)
  }

  // Check if any filters are active
  const hasActiveFilters = filterData.role !== "" || 
    filterData.department !== "" || 
    filterData.sortBy !== "createdAt" || 
    filterData.sortOrder !== "desc";

  // Clear individual filter
  const clearFilter = (key: string) => {
    setFilterData(prev => ({
      ...prev,
      [key]: key === "sortBy" ? "createdAt" : key === "sortOrder" ? "desc" : "",
    }));
  };

  if (status === "loading" || !session) {
    return <div>Loading...</div>
  }

  return (
    <DashboardLayout
      appName="ASTU Events"
      appLogo="/placeholder.svg?height=32&width=32"
      helpText="Need Assistance?"
      helpLink="/dashboard/admin/support"
    >
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">User Management</h1>
        <p className="text-muted-foreground">Manage users, roles, and permissions</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-green-100 p-3">
              <UserCheck className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Users</p>
              <p className="text-2xl font-semibold">{stats.activeUsers}</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-blue-100 p-3">
              <UserPlus className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">New Users</p>
              <p className="text-2xl font-semibold">{stats.newUsers}</p>
              <p className="text-xs text-green-600">Last 30 days</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-red-100 p-3">
              <UserX className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Inactive Users</p>
              <p className="text-2xl font-semibold">{stats.inactiveUsers}</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-purple-100 p-3">
              <UserCheck className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Verified Users</p>
              <p className="text-2xl font-semibold">{stats.verifiedUsers}</p>
              <p className="text-xs text-green-600">
                {((stats.verifiedUsers / stats.total) * 100).toFixed(0)}% verification rate
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-white shadow-sm">
        <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search users..."
                onChange={handleSearchChange}
                className="h-10 rounded-md border border-input bg-background pl-8 pr-4 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full sm:w-[300px]"
                disabled={isLoading}
              />
            </div>
            <button 
              onClick={() => setIsFilterOpen(true)}
              className={cn(
                "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2",
                hasActiveFilters && "border-green-500 text-green-600"
              )}
              disabled={isLoading}
            >
              <Filter className="mr-2 h-4 w-4" />
              Filter
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-2 bg-green-100 text-green-600">
                  {Object.values(filterData).filter(v => v !== "" && v !== "createdAt" && v !== "desc").length}
                </Badge>
              )}
            </button>
          </div>
          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="mt-2 flex flex-wrap gap-2">
              {filterData.role && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Role: {filterData.role}
                  <XCircle 
                    className="ml-1 h-3 w-3 cursor-pointer hover:text-red-500" 
                    onClick={() => clearFilter("role")}
                  />
                </Badge>
              )}
              {filterData.department && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Department: {filterData.department}
                  <XCircle 
                    className="ml-1 h-3 w-3 cursor-pointer hover:text-red-500" 
                    onClick={() => clearFilter("department")}
                  />
                </Badge>
              )}
              {filterData.sortBy !== "createdAt" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Sort by: {filterData.sortBy}
                  <XCircle 
                    className="ml-1 h-3 w-3 cursor-pointer hover:text-red-500" 
                    onClick={() => clearFilter("sortBy")}
                  />
                </Badge>
              )}
              {filterData.sortOrder !== "desc" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Order: {filterData.sortOrder}
                  <XCircle 
                    className="ml-1 h-3 w-3 cursor-pointer hover:text-red-500" 
                    onClick={() => clearFilter("sortOrder")}
                  />
                </Badge>
              )}
              <button
                onClick={resetFilters}
                className="text-sm text-red-500 hover:text-red-600 flex items-center"
              >
                <X className="mr-1 h-3 w-3" />
                Clear all filters
              </button>
            </div>
          )}
          <div className="flex flex-col gap-2 sm:flex-row">
           <button
              onClick={openAddUserForm}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-green-600 text-white hover:bg-green-700 h-10 px-4 py-2"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </button>
          </div>
        </div>
        <div className="border-t">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Email</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Role</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Joined</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="p-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-green-500 border-t-transparent"></div>
                        <span>Loading...</span>
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={7} className="p-4 text-center text-red-500">
                      {error}
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-4 text-center">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                  <tr key={user.id} className="border-b">
                    <td className="p-4 align-middle">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                            {user.image ? (
                            <img
                                src={user.image}
                              alt={user.name}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-sm font-medium text-gray-600">
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">ID: {user.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 align-middle">{user.email}</td>
                    <td className="p-4 align-middle">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            user.role === "ADMIN"
                            ? "bg-purple-100 text-purple-800"
                              : user.role === "EVENT_ORGANIZER"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 align-middle">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            user.emailVerified
                            ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                          {user.emailVerified ? "Verified" : "Pending"}
                      </span>
                    </td>
                      <td className="p-4 align-middle">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openUserDetail(user)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-input p-0 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </button>
                          <button 
                            onClick={() => handleUserUpdate(user.id, { role: "EVENT_ORGANIZER" })}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-input p-0 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                          >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </button>
                          <button 
                            onClick={() => {
                              if (window.confirm("Are you sure you want to delete this user?")) {
                                handleUserDelete(user.id)
                              }
                            }}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-input p-0 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                          >
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </button>
                        <button className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-input p-0 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">More</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-4 py-4">
            <div className="text-sm text-muted-foreground">
              Showing <strong>{users.length > 0 ? (page - 1) * limit + 1 : 0}</strong> to{" "}
              <strong>{Math.min(page * limit, stats.total)}</strong> of{" "}
              <strong>{stats.total}</strong> results
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0"
              >
                <span className="sr-only">Previous</span>
                ←
              </button>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page * limit >= stats.total}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0"
              >
                <span className="sr-only">Next</span>
                →
              </button>
            </div>
          </div>
        </div>
      </div>

      {isAddUserOpen && (
        <AddUserForm open={isAddUserOpen} onClose={closeAddUserForm} onSuccess={fetchUsers} />
      )}

      {selectedUser && (
        <UserDetailModal
          user={selectedUser}
          open={!!selectedUser}
          onClose={closeUserDetail}
          onUpdate={handleUserUpdate}
          onDelete={handleUserDelete}
        />
      )}

      {/* Filter Dialog */}
      <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Filter Users</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <Select
                value={filterData.role || "all"}
                onValueChange={(value) => handleFilterChange("role", value === "all" ? "" : value)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="STUDENT">Student</SelectItem>
                  <SelectItem value="EVENT_ORGANIZER">Event Organizer</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Department</label>
              <Select
                value={filterData.department || "all"}
                onValueChange={(value) => handleFilterChange("department", value === "all" ? "" : value)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {stats.departmentStats.map((dept) => (
                    <SelectItem key={dept.department} value={dept.department}>
                      {dept.department} ({dept._count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Sort By</label>
              <Select
                value={filterData.sortBy}
                onValueChange={(value) => handleFilterChange("sortBy", value)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select sort field" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Date Joined</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="role">Role</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Sort Order</label>
              <Select
                value={filterData.sortOrder}
                onValueChange={(value) => handleFilterChange("sortOrder", value)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select sort order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Ascending</SelectItem>
                  <SelectItem value="desc">Descending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={resetFilters} disabled={isLoading}>
              Reset
            </Button>
            <Button onClick={() => setIsFilterOpen(false)} disabled={isLoading}>
              Apply Filters
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
