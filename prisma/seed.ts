import { PrismaClient, UserRole, EventType, ApprovalStatus } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create test users
  const password = await hash('password123', 12);
  
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Test Student 1',
        email: 'student1@test.com',
        password,
        role: UserRole.STUDENT,
        department: 'Computer Science',
        year: 3,
        image: null,
      },
    }),
    prisma.user.create({
      data: {
        name: 'Test Student 2',
        email: 'student2@test.com',
        password,
        role: UserRole.STUDENT,
        department: 'Computer Science',
        year: 2,
        image: null,
      },
    }),
    prisma.user.create({
      data: {
        name: 'Test Organizer',
        email: 'organizer@test.com',
        password,
        role: UserRole.EVENT_ORGANIZER,
        department: 'Computer Science',
        image: null,
      },
    }),
  ]);

  // Create test events
  const events = await Promise.all([
    prisma.event.create({
      data: {
        title: 'Web Development Workshop',
        description: 'Learn modern web development techniques',
        date: new Date('2024-04-01'),
        startTime: '10:00',
        endTime: '12:00',
        location: 'Room 101',
        venue: 'Main Campus',
        category: 'WORKSHOP',
        department: 'Computer Science',
        tags: JSON.stringify(['web', 'development', 'workshop']),
        images: null,
        contactEmail: 'organizer@test.com',
        contactPhone: '1234567890',
        eventType: EventType.IN_PERSON,
        isPublic: true,
        requiresApproval: true,
        allowFeedback: true,
        organizerInfo: true,
        featured: true,
        capacity: 50,
        registrationDeadline: new Date('2024-03-30'),
        approvalStatus: ApprovalStatus.APPROVED,
        createdById: users[2].id,
      },
    }),
    prisma.event.create({
      data: {
        title: 'AI and Machine Learning Seminar',
        description: 'Introduction to AI and ML concepts',
        date: new Date('2024-04-05'),
        startTime: '14:00',
        endTime: '16:00',
        location: 'Room 202',
        venue: 'Engineering Building',
        category: 'SEMINAR',
        department: 'Computer Science',
        tags: JSON.stringify(['ai', 'ml', 'seminar']),
        images: null,
        contactEmail: 'organizer@test.com',
        contactPhone: '1234567890',
        eventType: EventType.IN_PERSON,
        isPublic: true,
        requiresApproval: true,
        allowFeedback: true,
        organizerInfo: true,
        featured: true,
        capacity: 100,
        registrationDeadline: new Date('2024-04-03'),
        approvalStatus: ApprovalStatus.APPROVED,
        createdById: users[2].id,
      },
    }),
    prisma.event.create({
      data: {
        title: 'Mobile App Development Workshop',
        description: 'Build your first mobile app',
        date: new Date('2024-04-10'),
        startTime: '09:00',
        endTime: '17:00',
        location: 'Room 303',
        venue: 'Innovation Hub',
        category: 'WORKSHOP',
        department: 'Computer Science',
        tags: JSON.stringify(['mobile', 'app', 'development']),
        images: null,
        contactEmail: 'organizer@test.com',
        contactPhone: '1234567890',
        eventType: EventType.IN_PERSON,
        isPublic: true,
        requiresApproval: true,
        allowFeedback: true,
        organizerInfo: true,
        featured: true,
        capacity: 30,
        registrationDeadline: new Date('2024-04-08'),
        approvalStatus: ApprovalStatus.APPROVED,
        createdById: users[2].id,
      },
    }),
  ]);

  // Create registrations
  await Promise.all([
    prisma.registration.create({
      data: {
        userId: users[0].id,
        eventId: events[0].id,
        status: 'CONFIRMED',
      },
    }),
    prisma.registration.create({
      data: {
        userId: users[0].id,
        eventId: events[1].id,
        status: 'CONFIRMED',
      },
    }),
    prisma.registration.create({
      data: {
        userId: users[1].id,
        eventId: events[0].id,
        status: 'CONFIRMED',
      },
    }),
  ]);

  // Create feedback data
  await Promise.all([
    prisma.feedback.create({
      data: {
        userId: users[0].id,
        eventId: events[0].id,
        rating: 5,
        comment: 'Great workshop! Learned a lot.',
      },
    }),
    prisma.feedback.create({
      data: {
        userId: users[0].id,
        eventId: events[1].id,
        rating: 4,
        comment: 'Very informative seminar.',
      },
    }),
    prisma.feedback.create({
      data: {
        userId: users[1].id,
        eventId: events[0].id,
        rating: 4,
        comment: 'Good content and presentation.',
      },
    }),
  ]);

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 