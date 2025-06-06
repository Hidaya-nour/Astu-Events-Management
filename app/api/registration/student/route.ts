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
            registrations: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                    department: true,
                    year: true
                  }
                }
              }
            },
            _count: {
              select: {
                registrations: true
              }
            }
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
      organizerAvatar: registration.event.createdBy.image,
      createdById: registration.event.createdBy.id,
      capacity: registration.event.capacity,
      _count: {
        registrations: registration.event._count.registrations
      },
      tags: registration.event.tags ? registration.event.tags.split(',') : [],
      rating: null, // This will be fetched separately if needed
      attendees: registration.event.registrations.map(reg => ({
        id: reg.user.id,
        name: reg.user.name,
        email: reg.user.email,
        image: reg.user.image,
        department: reg.user.department,
        year: reg.user.year,
        registrationStatus: reg.status
      }))
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
