import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    // Get the first user's ID for testing
    const firstUser = await prisma.user.findFirst()
    if (!firstUser) {
      return NextResponse.json(
        { error: 'No users found in the database' },
        { status: 404 }
      )
    }
   
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    const userRole = session?.user?.role;
    const events = await prisma.event.findMany({
      
      where: {
        createdById: userId,
      },
      orderBy: {
        date: "desc",
      },
      include: {
        _count: {
          select: {
            registrations: true,
          },
        },
      },
    })

    const formattedEvents = events.map((event) => ({
      id: event.id,
      title: event.title,
      date: event.date,
      startTime: event.startTime,
      endTime: event.endTime,
      location: event.location,
      category: event.category,
      status: event.approvalStatus,
      capacity: event.capacity,
      currentAttendees: event._count.registrations,
    }))

    return NextResponse.json(formattedEvents)
  } catch (error) {
    console.error("[EVENTS_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 