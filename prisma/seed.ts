import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Create users
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'hashedpassword',
      role: 'ADMIN',
    },
  });

  const student = await prisma.user.create({
    data: {
      name: 'Student One',
      email: 'student1@example.com',
      password: 'hashedpassword',
      role: 'STUDENT',
      year: 2,
      department: 'Computer Science',
    },
  });

  const organizer = await prisma.user.create({
    data: {
      name: 'Event Organizer',
      email: 'organizer@example.com',
      password: 'hashedpassword',
      role: 'EVENT_ORGANIZER',
      department: 'Engineering',
    },
  });

  // Create events
  const upcomingEvent = await prisma.event.create({
    data: {
      title: 'Tech Meetup 2025',
      description: 'A gathering of tech enthusiasts.',
      date: new Date(new Date().getFullYear() + 1, 0, 15),
      startTime: '10:00 AM',
      endTime: '3:00 PM',
      location: 'Main Hall',
      venue: 'Building A',
      category: 'TECH',
      department: 'Engineering',
      capacity: 100,
      eventType: 'IN_PERSON',
      createdById: organizer.id,
      approvalStatus: 'APPROVED',
    },
  });

  const pastEvent = await prisma.event.create({
    data: {
      title: 'Past Seminar 2024',
      description: 'A past event for testing.',
      date: new Date(new Date().getFullYear() - 1, 5, 10),
      startTime: '1:00 PM',
      endTime: '4:00 PM',
      location: 'Auditorium',
      category: 'EDUCATION',
      capacity: 50,
      eventType: 'ONLINE',
      createdById: organizer.id,
      approvalStatus: 'APPROVED',
    },
  });

  // Registrations
  await prisma.registration.createMany({
    data: [
      {
        eventId: upcomingEvent.id,
        userId: student.id,
        status: 'CONFIRMED',
      },
      {
        eventId: pastEvent.id,
        userId: student.id,
        status: 'WAITLISTED',
      },
    ],
  });

  // Feedback
  await prisma.feedback.create({
    data: {
      eventId: pastEvent.id,
      userId: student.id,
      rating: 4,
      comment: 'Great event, well organized!',
    },
  });

  console.log('Seed completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
