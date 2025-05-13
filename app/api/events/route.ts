import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from "../../../lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();

    // Validate required fields
    const requiredFields = ['title', 'description', 'date', 'startTime', 'location', 'category', 'capacity'];
    const missingFields = requiredFields.filter(field => !data[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate date format and logic
    const eventDate = new Date(data.date);
    if (isNaN(eventDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid event date format' },
        { status: 400 }
      );
    }

    // Validate registration deadline if provided
    let registrationDeadline = null;
    if (data.registrationDeadline) {
      registrationDeadline = new Date(data.registrationDeadline);
      if (isNaN(registrationDeadline.getTime())) {
        return NextResponse.json(
          { error: 'Invalid registration deadline format' },
          { status: 400 }
        );
      }
      if (registrationDeadline > eventDate) {
        return NextResponse.json(
          { error: 'Registration deadline cannot be after event date' },
          { status: 400 }
        );
      }
    }

    // Validate capacity
    const capacity = parseInt(data.capacity);
    if (isNaN(capacity) || capacity <= 0) {
      return NextResponse.json(
        { error: 'Capacity must be a positive number' },
        { status: 400 }
      );
    }

    // Create event in database
    const event = await prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        date: eventDate,
        startTime: data.startTime,
        endTime: data.endTime || null,
        location: data.location,
        venue: data.venue || null,
        category: data.category,
        capacity: capacity,
        registrationDeadline: registrationDeadline,
        isPublic: data.isPublic ?? true,
        requiresApproval: data.requiresApproval ?? false,
        allowFeedback: data.allowFeedback ?? true,
        organizerInfo: data.organizerInfo ?? true,
        eventType: data.eventType || 'IN_PERSON',
        department: data.department || null,
        contactEmail: data.contactEmail || null,
        contactPhone: data.contactPhone || null,
        tags: data.tags || [],
        images: data.images || [],
        createdById: session.user.id,
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    
    // Handle specific Prisma errors
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A unique constraint would be violated' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Error creating event' },
      { status: 500 }
    );
  }
} 