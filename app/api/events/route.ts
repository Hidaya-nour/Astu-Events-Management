import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";
import { z } from 'zod';
import { notificationService } from "@/lib/services/notification-service";
import { NotificationType } from "@prisma/client";

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
  featured: z.boolean().default(false),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      description,
      date,
      startTime,
      endTime,
      location,
      venue,
      category,
      department,
      tags,
      images,
      contactEmail,
      contactPhone,
      eventType,
      isPublic,
      requiresApproval,
      allowFeedback,
      organizerInfo,
      featured,
      capacity,
      registrationDeadline,
    } = body;

    const event = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        startTime,
        endTime,
        location,
        venue,
        category,
        department,
        tags,
        images,
        contactEmail,
        contactPhone,
        eventType,
        isPublic,
        requiresApproval,
        allowFeedback,
        organizerInfo,
        featured,
        capacity,
        registrationDeadline: registrationDeadline ? new Date(registrationDeadline) : null,
        createdById: session.user.id,
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
          message: `A new event "${title}" has been created. Check it out!`,
          type: NotificationType.EVENT_CREATED,
        })
      )
    );

    return NextResponse.json(event);
  } catch (error) {
    console.error("[EVENTS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
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
    const registeredBy = searchParams.get('registeredBy'); // <- NEW

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
      if (status.includes('registered')) {
        where.registrations = {
          some: {
            userId: userId,
            status: 'CONFIRMED'
          }
        };
      } else {
        where.approvalStatus = {
          in: status.map(s => s.trim().toUpperCase())
        };
      }
    }

    if (search) {
      where.OR = [
        { 
          title: { 
            contains: search.toLowerCase()
          } 
        },
        { 
          description: { 
            contains: search.toLowerCase()
          } 
        }
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
      case 'waitlisted':
        where.approvalStatus = 'WAITLISTED';
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
    if (registeredBy) {
      where.registrations = {
        some: {
          userId: registeredBy
        }
      };
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
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}