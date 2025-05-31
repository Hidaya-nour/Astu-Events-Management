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
    const { eventId } = params

    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in to register for events' },
        { status: 401 }
      )
    }

    const userId = session.user.id

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

    if (event.registrationDeadline && new Date(event.registrationDeadline) < new Date()) {
      return NextResponse.json(
        { error: "Registration deadline has passed" },
        { status: 400 }
      )
    }

    const existingRegistration = await prisma.registration.findFirst({
      where: {
        eventId,
        userId
      }
    });

    if (existingRegistration) {
      // ❌ Block re-registration if status is active
      if (
        existingRegistration.status === RegistrationStatus.CONFIRMED ||
        existingRegistration.status === RegistrationStatus.PENDING ||
        existingRegistration.status === RegistrationStatus.WAITLISTED
      ) {
        return NextResponse.json(
          { error: "Already registered for this event" },
          { status: 400 }
        )
      }

      // ✅ If status is CANCELLED, update it
      const updatedRegistration = await prisma.registration.update({
        where: { id: existingRegistration.id },
        data: {
          status:
            event._count.registrations >= event.capacity
              ? RegistrationStatus.WAITLISTED
              : RegistrationStatus.CONFIRMED
        }
      })

      return NextResponse.json({
        message: `Registration status updated to ${updatedRegistration.status}`,
        registration: updatedRegistration
      })
    }

    // If no previous registration, create a new one
    const newRegistration = await prisma.registration.create({
      data: {
        eventId,
        userId,
        status:
          event._count.registrations >= event.capacity
            ? RegistrationStatus.WAITLISTED
            : RegistrationStatus.CONFIRMED
      }
    })

    return NextResponse.json({
      message: "Successfully registered for event",
      registration: newRegistration
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

    // First check if the registration exists
    const existingRegistration = await prisma.registration.findUnique({
      where: {
        eventId_userId: {
          eventId,
          userId,
        },
      },
    });

    if (!existingRegistration) {
      return NextResponse.json(
        { error: "Registration not found" },
        { status: 404 }
      );
    }

    console.log('Found registration:', existingRegistration);

    // Find and update the registration status to CANCELLED
    const registration = await prisma.registration.update({
      where: {
        eventId_userId: {
          eventId,
          userId,
        },
      },
      data: {
        status: RegistrationStatus.CANCELLED,
      },
    });

    console.log('Updated registration:', registration);

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