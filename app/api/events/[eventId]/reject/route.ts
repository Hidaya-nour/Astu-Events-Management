import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
  request: Request,
  { params }: { params: { eventId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const event = await prisma.event.update({
      where: {
        id: params.eventId,
      },
      data: {
        approvalStatus: "REJECTED",
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
    console.error("[EVENT_REJECT]", error)
    return new NextResponse(
      JSON.stringify({ error: "Failed to reject event" }), 
      { status: 500 }
    )
  }
} 