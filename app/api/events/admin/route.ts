import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

const prisma = new PrismaClient()

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    console.log("Session:", session) // Debug log

    if (!session) {
      console.log("No session found") // Debug log
      return new NextResponse("Unauthorized - No session", { status: 401 })
    }

    if (session.user.role !== "ADMIN") {
      console.log("User role:", session.user.role) // Debug log
      return new NextResponse("Unauthorized - Not an admin", { status: 403 })
    }

    // Get total users count
    const totalUsers = await prisma.user.count({
      where: {
        role: "STUDENT"
      }
    }).catch(error => {
      console.error("Error counting users:", error)
      throw new Error("Failed to count users")
    })

    // Get total events count
    const totalEvents = await prisma.event.count().catch(error => {
      console.error("Error counting events:", error)
      throw new Error("Failed to count events")
    })

    // Get total organizations count (users with EVENT_ORGANIZER role)
    const totalOrganizations = await prisma.user.count({
      where: {
        role: "EVENT_ORGANIZER"
      }
    }).catch(error => {
      console.error("Error counting organizations:", error)
      throw new Error("Failed to count organizations")
    })

    // Get pending approvals count (events with PENDING status)
    const pendingApprovals = await prisma.event.count({
      // where: {
      //   ApprovalStatus: "PENDING"
      // }
    }).catch(error => {
      console.error("Error counting pending approvals:", error)
      throw new Error("Failed to count pending approvals")
    })

    // Get recent events
    const recentEvents = await prisma.event.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        createdBy: {
          select: {
            name: true
          }
        }
      }
    }).catch(error => {
      console.error("Error fetching recent events:", error)
      throw new Error("Failed to fetch recent events")
    })

    // Get recent user registrations
    const recentUsers = await prisma.user.findMany({
      take: 5,
      where: {
        role: "STUDENT"
      },
      orderBy: {
        createdAt: 'desc'
      }
    }).catch(error => {
      console.error("Error fetching recent users:", error)
      throw new Error("Failed to fetch recent users")
    })

    // Get recent organization registrations
    const recentOrganizations = await prisma.user.findMany({
      take: 5,
      where: {
        role: "EVENT_ORGANIZER"
      },
      orderBy: {
        createdAt: 'desc'
      }
    }).catch(error => {
      console.error("Error fetching recent organizations:", error)
      throw new Error("Failed to fetch recent organizations")
    })

    const stats = {
      totalUsers,
      totalEvents,
      totalOrganizations,
      pendingApprovals,
      recentActivity: {
        events: recentEvents.map(event => ({
          ...event,
          organizer: {
            name: event.createdBy.name
          }
        })),
        users: recentUsers,
        organizations: recentOrganizations
      }
    }

    console.log("Stats:", stats) // Debug log
    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error in admin stats API:", error)
    return new NextResponse(
      JSON.stringify({ 
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : "Unknown error"
      }), 
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  }
} 