import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PUT(
  request: Request,
  { params }: { params: { eventId: string } }
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
      where: { id: params.eventId },
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
        id: params.eventId,
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
          
          
        // title,
        // description,
        // date: new Date(date),
        // startTime,
        // endTime,
        // location,
        // category,
        // eventType,
        // capacity: parseInt(capacity),
        // approvalStatus,
        // venue,
        // department,
        // contactEmail,
        // contactPhone,
        // tags: tags ? tags.join(',') : undefined,
        // images: images ? images.join(',') : undefined,
        // isPublic: isPublic ?? true,
        // requiresApproval: requiresApproval ?? false,
        // allowFeedback: allowFeedback ?? true,
        // organizerInfo: organizerInfo ?? true,
        // registrationDeadline: registrationDeadline ? new Date(registrationDeadline) : null,
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
  { params }: { params: { eventId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const event = await prisma.event.delete({
      where: {
        id: params.eventId,
      },
    })

    return NextResponse.json(event)
  } catch (error) {
    console.error("[EVENT_DELETE]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function GET(
  request: Request,
  { params }: { params: { eventId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const event = await prisma.event.findUnique({
      where: {
        id: params.eventId,
      },
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

    if (!event) {
      return new NextResponse("Event not found", { status: 404 })
    }

    // Transform the response to match the expected format
    const transformedEvent = {
      ...event,
      organizer: {
        id: event.createdBy.id,
        name: event.createdBy.name,
        avatar: event.createdBy.image,
      },
    }

    return NextResponse.json(transformedEvent)
  } catch (error) {
    console.error("[EVENT_GET]", error)
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch event" }), 
      { status: 500 }
    )
  }
} 