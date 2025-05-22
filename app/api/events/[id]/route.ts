import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const eventId = params.id

    // Get the event with registration count and user's registration status
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        _count: {
          select: { registrations: true }
        },
        registrations: {
          where: {
            userId: session.user.id
          },
          select: {
            id: true,
            status: true
          }
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      }
    })

    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      )
    }

    // Transform the data to include registration status and organizer info
    const transformedEvent = {
      ...event,
      tags: event.tags ? JSON.parse(event.tags) : [],
      images: event.images ? JSON.parse(event.images) : [],
      userRegistration: event.registrations[0] || null,
      availableSeats: event.capacity - event._count.registrations,
      organizer: {
        id: event.createdBy.id,
        name: event.createdBy.name,
        avatar: event.createdBy.image,
      }
    }

    // Remove the registrations array from the response
    delete transformedEvent.registrations

    return NextResponse.json(transformedEvent)

  } catch (error) {
    console.error("Error fetching event details:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await request.json()
    const { 
      title, 
      description, 
      date, 
      startTime, 
      endTime, 
      location, 
      category, 
      eventType, 
      capacity,
      approvalStatus,
      featured,
      venue,
      department,
      contactEmail,
      contactPhone,
      tags,
      images,
      isPublic,
      requiresApproval,
      allowFeedback,
      organizerInfo,
      registrationDeadline
    } = body

    if (!body || Object.keys(body).length === 0) {
      return new NextResponse("No data provided", { status: 400 })
    }

    // First, get the event with its creator
    const existingEvent = await prisma.event.findUnique({
      where: { id: params.id },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })

    if (!existingEvent) {
      return new NextResponse("Event not found", { status: 404 })
    }

    // Update the event
    const updatedEvent = await prisma.event.update({
      where: {
        id: params.id,
      },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(date && { date: new Date(date) }),
        ...(startTime && { startTime }),
        ...(endTime && { endTime }),
        ...(location && { location }),
        ...(category && { category }),
        ...(eventType && { eventType }),
        ...(capacity && { capacity: parseInt(capacity) }),
        ...(approvalStatus && { approvalStatus }),
        ...(venue && { venue }),
        ...(department && { department }),
        ...(contactEmail && { contactEmail }),
        ...(contactPhone && { contactPhone }),
        ...(tags && { tags: tags.join(',') }),
        ...(images && { images: images.join(',') }),
        ...(isPublic && { isPublic }),
        ...(requiresApproval && { requiresApproval }),
        ...(allowFeedback && { allowFeedback }),
        ...(organizerInfo && { organizerInfo }),
        ...(registrationDeadline && { registrationDeadline: new Date(registrationDeadline) }),
      },
    })

    // Transform the response to match the expected format
    const transformedEvent = {
      ...updatedEvent,
      organizer: {
        id: existingEvent.createdBy.id,
        name: existingEvent.createdBy.name,
        avatar: existingEvent.createdBy.image,
      },
    }

    return NextResponse.json(transformedEvent)
  } catch (error) {
    console.error("[EVENT_UPDATE]", error)
    return new NextResponse(
      JSON.stringify({ error: "Failed to update event" }), 
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const event = await prisma.event.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json(event)
  } catch (error) {
    console.error("[EVENT_DELETE]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 