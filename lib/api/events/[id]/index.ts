import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            registrations: true,
          },
        },
      },
    })

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    // Transform the response
    const transformedEvent = {
      ...event,
      organizer: {
        id: event.createdBy.id,
        name: event.createdBy.name,
        avatar: event.createdBy.image,
      },
    }

    return NextResponse.json({ event: transformedEvent })
  } catch (error) {
    console.error("Error fetching event details:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
