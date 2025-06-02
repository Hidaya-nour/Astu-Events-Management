import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";
import { z } from 'zod';
import { notificationService } from "@/lib/services/notification-service";
import { Prisma } from "@prisma/client";

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
  tags: z.array(z.string()).max(10, 'Maximum 10 tags allowed').default([]).transform(tags => tags.join(',')),
  images: z.array(z.string().url('Invalid image URL')).max(5, 'Maximum 5 images allowed').default([]).transform(images => images.join(',')),
  featured: z.boolean().default(false),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    console.log("Received event data:", body);
    
    const validatedData = eventSchema.parse(body);
    console.log("Validated data:", validatedData);

    const event = await prisma.event.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        date: new Date(validatedData.date),
        startTime: validatedData.startTime,
        endTime: validatedData.endTime,
        location: validatedData.location,
        venue: validatedData.venue,
        category: validatedData.category,
        capacity: validatedData.capacity,
        registrationDeadline: validatedData.registrationDeadline ? new Date(validatedData.registrationDeadline) : null,
        isPublic: validatedData.isPublic,
        requiresApproval: validatedData.requiresApproval,
        allowFeedback: validatedData.allowFeedback,
        organizerInfo: validatedData.organizerInfo,
        eventType: validatedData.eventType,
        department: validatedData.department,
        contactEmail: validatedData.contactEmail,
        contactPhone: validatedData.contactPhone,
        tags: validatedData.tags,
        images: validatedData.images,
        featured: validatedData.featured,
        createdById: session.user.id,
        approvalStatus: "PENDING"
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
    });

    // Get all students to notify them about the new event
    const students = await prisma.user.findMany({
      where: {
        role: "STUDENT",
      },
      select: {
        id: true,
      },
    });

    // Create notifications for all students
    await Promise.all(
      students.map((student) =>
        notificationService.create({
          userId: student.id,
          title: "New Event Created",
          message: `A new event "${validatedData.title}" has been created. Check it out!`,
          type: "EVENT_CREATED",
        })
      )
    );

    // Transform the response to match the expected format
    const transformedEvent = {
      ...event,
      organizer: {
        id: event.createdBy.id,
        name: event.createdBy.name,
        avatar: event.createdBy.image,
      },
    };

    return NextResponse.json(transformedEvent);
  } catch (error) {
    console.error("[EVENTS_POST]", error);
    return NextResponse.json(
      { error: error.message || "Failed to create event" },
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
    
    // Build filter conditions
    const where: any = {};

    if (userRole === 'EVENT_ORGANIZER' && userId) {
      where.createdById = userId;
    }
    
    // Exclude events that the user has already registered for
    if (userId) {
      where.NOT = {
        registrations: {
          some: {
            userId: userId,
            status: 'CONFIRMED'
          }
        }
      };
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
        in: status.map(s => s.toUpperCase())
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Determine sort order
    const orderBy: Prisma.EventOrderByWithRelationInput = sort === 'oldest' 
      ? { date: 'asc' } 
      : sort === 'popular' 
        ? { registrations: { _count: 'desc' } }
        : { date: 'desc' };

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
          _count: {
            select: {
              registrations: true
            }
          }
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
      _count: {
        registrations: event._count.registrations
      }
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
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}