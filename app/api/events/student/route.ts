import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get the student's ID from the session
    const userId = session.user.id

    // Fetch events that the student is registered for
    const studentEvents = await prisma.registration.findMany({
      where: {
        userId: userId,
      },
      include: {
        event: {
          include: {
            createdBy: true,
          },
        },
      },
    })

    // Transform the data to match the frontend requirements
    const formattedEvents = studentEvents.map(registration => ({
      id: registration.event.id,
      title: registration.event.title,
      description: registration.event.description,
      date: registration.event.date,
      location: registration.event.location,
      image: registration.event.images ? registration.event.images.split(',')[0] : null,
      status: registration.status,
      category: registration.event.category,
      organizer: registration.event.createdBy.name,
      tags: registration.event.tags ? registration.event.tags.split(',') : [],
      rating: null, // This will be fetched separately if needed
    }))

    return NextResponse.json(formattedEvents)
  } catch (error) {
    console.error('Error fetching student events:', error)
    return NextResponse.json(
      { error: 'Failed to fetch student events' },
      { status: 500 }
    )
  }
}
