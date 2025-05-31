import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { RegistrationStatus } from "@prisma/client"
import { getServerSession } from 'next-auth'
import { authOptions } from "@/lib/auth"

export async function POST(
  request: Request,
  { params }: { params: { eventId: string } }
) {
  try {
    // Get the eventId first
    const { eventId } = params

    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in to register for events' },
        { status: 401 }
      )
    }

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

    // Check if registration deadline has passed
    if (event.registrationDeadline && new Date(event.registrationDeadline) < new Date()) {
      return NextResponse.json(
        { error: "Registration deadline has passed" },
        { status: 400 }
      )
    }

    const existingRegistration = await prisma.registration.findFirst({
      where: {
        AND: [
          { eventId },
          { userId },
          {
            OR: [
              { status: RegistrationStatus.PENDING },
              { status: RegistrationStatus.CONFIRMED },
              { status: RegistrationStatus.WAITLISTED }
            ]
          }
        ]
      },
    });
    

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
      { error: "Failed to register for event - Please try again later" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { eventId: string } }
) {
  try {
    const { eventId } = params;

    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in to cancel registration' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Find and delete the registration
    const registration = await prisma.registration.delete({
      where: {
        eventId_userId: {
          eventId,
          userId,
        },
      },
    });

    return NextResponse.json({
      message: "Successfully cancelled registration",
      registration,
    });
  } catch (error) {
    console.error("Cancellation error:", error);
    return NextResponse.json(
      { error: "Failed to cancel registration - Please try again later" },
      { status: 500 }
    );
  }
} 