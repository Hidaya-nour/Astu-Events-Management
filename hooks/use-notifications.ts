import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { toast } from "react-toastify"

interface Notification {
  id: string
  title: string
  message: string
  type: string
  read: boolean
  createdAt: string
}

export function useNotifications() {
  const { data: session } = useSession()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/notifications")
      if (!response.ok) throw new Error("Failed to fetch notifications")
      const data = await response.json()
      setNotifications(data)
      setUnreadCount(data.filter((n: Notification) => !n.read).length)
    } catch (error) {
      console.error("Error fetching notifications:", error)
      toast.error("Failed to load notifications")
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: "PATCH",
      })
      if (!response.ok) throw new Error("Failed to mark notification as read")
      
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      )
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch (error) {
      console.error("Error marking notification as read:", error)
      toast.error("Failed to mark notification as read")
    }
  }

  const deleteNotification = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete notification")
      
      setNotifications((prev) => prev.filter((n) => n.id !== id))
      setUnreadCount((prev) =>
        Math.max(0, prev - (notifications.find((n) => n.id === id)?.read ? 0 : 1))
      )
    } catch (error) {
      console.error("Error deleting notification:", error)
      toast.error("Failed to delete notification")
    }
  }

  useEffect(() => {
    if (session?.user) {
      fetchNotifications()
    }
  }, [session])

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    deleteNotification,
    refreshNotifications: fetchNotifications,
  }
} 