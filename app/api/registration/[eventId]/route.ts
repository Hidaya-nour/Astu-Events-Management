import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { RegistrationStatus } from "@prisma/client"

export async function POST(
  request: Request,
  { params }: { params: { eventId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const eventId = params.eventId
    const userId = session.user.id

    // Check if event exists and has available capacity
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        _count: {
          select: { registrations: true }
        }
      }
    })

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    // Check if user is already registered
    const existingRegistration = await prisma.registration.findFirst({
      where: {
        eventId,
        userId,
        OR: [
          { status: RegistrationStatus.PENDING },
          { status: RegistrationStatus.CONFIRMED },
          { status: RegistrationStatus.WAITLISTED }
        ]
      },
    })

    if (existingRegistration) {
      return NextResponse.json(
        { error: "Already registered for this event" },
        { status: 400 }
      )
    }

    // Check if event is at capacity
    if (event._count.registrations >= event.capacity) {
      // Create waitlist registration
      const registration = await prisma.registration.create({
        data: {
          eventId,
          userId,
          status: RegistrationStatus.WAITLISTED,
        },
      })

      return NextResponse.json({
        message: "Added to waitlist",
        registration,
      })
    }

    // Create regular registration
    const registration = await prisma.registration.create({
      data: {
        eventId,
        userId,
        status: RegistrationStatus.CONFIRMED,
      },
    })

    return NextResponse.json({
      message: "Successfully registered for event",
      registration,
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Failed to register for event" },
      { status: 500 }
    )
  }
} 