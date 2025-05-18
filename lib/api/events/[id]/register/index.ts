import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const userId = session.user.id
    const eventId = params.id

    // Check if the event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    })

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    // Check if already registered
    const existingRegistration = await prisma.eventRegistration.findFirst({
      where: {
        eventId,
        userId,
      },
    })

    if (existingRegistration) {
      return NextResponse.json({ error: "You are already registered for this event" }, { status: 400 })
    }

    // Check if the event is at capacity
    const registrationCount = await prisma.eventRegistration.count({
      where: { eventId },
    })

    if (registrationCount >= event.capacity) {
      return NextResponse.json({ error: "This event has reached its capacity" }, { status: 400 })
    }

    // Create registration
    const registration = await prisma.eventRegistration.create({
      data: {
        eventId,
        userId,
        status: event.requiresApproval ? "PENDING" : "CONFIRMED",
      },
    })

    return NextResponse.json({
      message: "Successfully registered for event",
      registration,
    })
  } catch (error) {
    console.error("Error registering for event:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
