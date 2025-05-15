import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

const prisma = new PrismaClient()

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      )
    }

    // Get total users count
    const totalUsers = await prisma.user.count({
      where: {
        role: "STUDENT"
      }
    })

    // Get total events count
    const totalEvents = await prisma.event.count()

    // Get total organizations count (users with EVENT_ORGANIZER role)
    const totalOrganizations = await prisma.user.count({
      where: {
        role: "EVENT_ORGANIZER"
      }
    })

    // Get pending approvals count (events with PENDING status)
    const pendingApprovals = await prisma.event.count({
      where: {
        approvalStatus: "PENDING"
      }
    })

    // Get event distribution by category
    const eventDistribution = await prisma.event.groupBy({
      by: ['category'],
      _count: {
        _all: true
      }
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
    })

    return NextResponse.json({
      totalUsers,
      totalEvents,
      totalOrganizations,
      pendingApprovals,
      eventDistribution: eventDistribution.map(dist => ({
        category: dist.category,
        count: dist._count._all
      })),
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
    })

  } catch (error) {
    console.error("Error in admin stats API:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
} 