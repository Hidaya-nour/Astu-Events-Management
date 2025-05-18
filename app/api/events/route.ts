import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";
import { z } from 'zod';

// Validation schema
const eventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title must be less than 100 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000, 'Description must be less than 2000 characters'),
  date: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid date format'),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:mm)'),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:mm)').optional(),
  location: z.string().min(3, 'Location must be at least 3 characters').max(200, 'Location must be less than 200 characters'),
  venue: z.string().max(200, 'Venue must be less than 200 characters').optional(),
  category: z.string().min(2, 'Category must be at least 2 characters').max(50, 'Category must be less than 50 characters'),
  capacity: z.number().int().positive('Capacity must be a positive number').max(10000, 'Capacity must be less than 10000'),
  registrationDeadline: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid date format').optional(),
  isPublic: z.boolean().default(true),
  requiresApproval: z.boolean().default(false),
  allowFeedback: z.boolean().default(true),
  organizerInfo: z.boolean().default(true),
  eventType: z.enum(['IN_PERSON', 'ONLINE', 'HYBRID']).default('IN_PERSON'),
  department: z.string().max(100, 'Department must be less than 100 characters').optional(),
  contactEmail: z.string().email('Invalid email format').optional(),
  contactPhone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format').optional(),
  tags: z.array(z.string()).max(10, 'Maximum 10 tags allowed').default([]),
  images: z.array(z.string().url('Invalid image URL')).max(5, 'Maximum 5 images allowed').default([]),
});

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    // Get a valid user ID for testing
    const firstUser = await prisma.user.findFirst();
    if (!firstUser) {
      return NextResponse.json(
        { error: 'No users found in the database. Please create a user first.' },
        { status: 400 }
      );
    }
    const userId = session?.user?.id || firstUser.id;

    // Parse and validate request body
    const body = await request.json();
    const validationResult = eventSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: validationResult.error.errors 
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Additional business logic validation
    const eventDate = new Date(data.date);
    const now = new Date();

    if (eventDate < now) {
      return NextResponse.json(
        { error: 'Event date cannot be in the past' },
        { status: 400 }
      );
    }

    if (data.registrationDeadline) {
      const registrationDeadline = new Date(data.registrationDeadline);
      if (registrationDeadline > eventDate) {
        return NextResponse.json(
          { error: 'Registration deadline cannot be after event date' },
          { status: 400 }
        );
      }
    }

    if (data.endTime && data.startTime) {
      const [startHours, startMinutes] = data.startTime.split(':').map(Number);
      const [endHours, endMinutes] = data.endTime.split(':').map(Number);
      const startTime = startHours * 60 + startMinutes;
      const endTime = endHours * 60 + endMinutes;

      if (endTime <= startTime) {
        return NextResponse.json(
          { error: 'End time must be after start time' },
          { status: 400 }
        );
      }
    }

    // Create event in database
    const role = session?.user?.role
    const approvalStatus = role === 'STUDENT' ? 'PENDING' : 'APPROVED';

    const event = await prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        date: eventDate,
        startTime: data.startTime,
        endTime: data.endTime,
        location: data.location,
        venue: data.venue,
        category: data.category,
        approvalStatus,
        capacity: data.capacity,
        registrationDeadline: data.registrationDeadline ? new Date(data.registrationDeadline) : null,
        isPublic: data.isPublic,
        requiresApproval: data.requiresApproval,
        allowFeedback: data.allowFeedback,
        organizerInfo: data.organizerInfo,
        eventType: data.eventType,
        department: data.department,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        tags: data.tags.join(',') as any,
        images: data.images.join(',') as any,
        createdById: userId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        date: true,
        startTime: true,
        endTime: true,
        location: true,
        venue: true,
        category: true,
        capacity: true,
        registrationDeadline: true,
        isPublic: true,
        requiresApproval: true,
        allowFeedback: true,
        organizerInfo: true,
        eventType: true,
        department: true,
        contactEmail: true,
        contactPhone: true,
        tags: true,
        images: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    return NextResponse.json(
      { 
        message: 'Event created successfully',
        event 
      },
      { status: 201 }
    );

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
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    const userRole = session?.user?.role;
    // Extract filter parameters
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const category = searchParams.get('category')?.split(',').filter(Boolean) || [];
    const eventType = searchParams.get('eventType');
    const status = searchParams.get('status')?.split(',').filter(Boolean) || [];
    const search = searchParams.get('search') || '';
    const sort = searchParams.get('sort') || 'newest';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    console.log({
      startDate,
      endDate,
      category,
      eventType,
      status,
      search,
      sort,
      
    });
    
    // Build filter conditions
    const where: any = {};

    if (userRole === 'EVENT_ORGANIZER' && userId) {
      where.createdById = userId;
    }
    
    if (startDate || endDate) {
      where.date = {};
      if (startDate) {
        where.date.gte = new Date(startDate);
      }
      if (endDate) {
        where.date.lte = new Date(endDate);
      }
    }
    
    if (category.length > 0) {
      where.category = {
        in: category.map(cat => cat.trim().toUpperCase())
      };
    }

    if (eventType) {
      where.eventType = eventType.toUpperCase();
    }

    if (status.length > 0) {
      where.approvalStatus = {
        in: status.map(s => s.trim().toUpperCase())
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Handle sorting
    let orderBy: any = {};
    switch (sort) {
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
      case 'oldest':
        orderBy = { createdAt: 'asc' };
        break;
      case 'upcoming':
        where.date = { gte: new Date() };
        orderBy = { date: 'asc' };
        break;
      case 'past':
        where.date = { lt: new Date() };
        orderBy = { date: 'desc' };
        break;
      case 'attendees':
        orderBy = { registrations: { _count: 'desc' } };
        break;
      case 'pending':
        where.approvalStatus = 'PENDING';
        orderBy = { createdAt: 'desc' };
        break;
      default:
        orderBy = { createdAt: 'desc' };
    }

    // Fetch events with pagination and include organizer data
    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      }),
      prisma.event.count({ where }),
    ]);

    // Transform the response to match the expected format
    const transformedEvents = events.map(event => ({
      ...event,
      organizer: {
        id: event.createdBy.id,
        name: event.createdBy.name,
        avatar: event.createdBy.image,
      },
    }));

    return NextResponse.json({
      events: transformedEvents,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}