import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: { eventId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id

    const event = await prisma.event.findUnique({
      where: { id: params.eventId },
      include: {
        _count: {
          select: { registrations: true }
        },
        registrations: userId ? {
          where: { userId },
          select: { status: true }
        } : undefined
      }
    })

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    // Transform the event data to match the frontend interface
    const transformedEvent = {
      id: event.id,
      title: event.title,
      description: event.description,
      date: event.date.toISOString().split('T')[0],
      time: event.startTime,
      endTime: event.endTime,
      location: event.location,
      venue: event.venue,
      category: event.category,
      image: event.images?.split(',')[0],
      capacity: event.capacity,
      registrations: event._count.registrations,
      registrationDeadline: event.registrationDeadline?.toISOString().split('T')[0],
      organizer: event.department,
      contactEmail: event.contactEmail,
      contactPhone: event.contactPhone,
      isRegistered: event.registrations?.[0]?.status ? true : false,
      registrationStatus: event.registrations?.[0]?.status,
      tags: event.tags?.split(',').filter(Boolean) || [],
      images: event.images?.split(',').filter(Boolean) || [],
      eventType: event.eventType,
      isPublic: event.isPublic,
      requiresApproval: event.requiresApproval,
      allowFeedback: event.allowFeedback,
      organizerInfo: event.organizerInfo,
    }

    return NextResponse.json(transformedEvent)
  } catch (error) {
    console.error("Error fetching event:", error)
    return NextResponse.json(
      { error: "Failed to fetch event details" },
      { status: 500 }
    )
  }
} 