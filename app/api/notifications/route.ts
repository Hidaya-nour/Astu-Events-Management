import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { notificationService } from "@/lib/services/notification-service"

// GET /api/notifications - Get all notifications for the current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const notifications = await notificationService.getByUserId(session.user.id)
    return NextResponse.json(notifications)
  } catch (error) {
    console.error("[NOTIFICATIONS_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

// POST /api/notifications - Create a new notification
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { userId, title, message, type } = body

    if (!userId || !title || !message || !type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const notification = await notificationService.create({
      userId,
      title,
      message,
      type,
    })

    return NextResponse.json(notification)
  } catch (error) {
    console.error("Error creating notification:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { id } = body

    if (!id) {
      return new NextResponse("Notification ID is required", { status: 400 })
    }

    const notification = await notificationService.markAsRead(id)
    return NextResponse.json(notification)
  } catch (error) {
    console.error("[NOTIFICATIONS_PATCH]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    await notificationService.markAllAsRead(session.user.id)
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("[NOTIFICATIONS_PUT]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 