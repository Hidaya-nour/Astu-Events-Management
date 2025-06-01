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
import { PrismaClient, UserRole, EventType, ApprovalStatus, RegistrationStatus, NotificationType } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.notification.deleteMany()
  await prisma.registration.deleteMany()
  await prisma.feedback.deleteMany()
  await prisma.event.deleteMany()
  await prisma.user.deleteMany()

  // Create 20 users
  const users = await Promise.all(
    Array.from({ length: 20 }, async (_, i) => {
      const role = i < 5 ? UserRole.ADMIN : i < 10 ? UserRole.EVENT_ORGANIZER : UserRole.STUDENT
      const hashedPassword = await hash('password123', 12)
      
      return prisma.user.create({
        data: {
          name: `User ${i + 1}`,
          email: `user${i + 1}@example.com`,
          password: hashedPassword,
          role,
          department: ['Computer Science', 'Engineering', 'Business', 'Arts', 'Science'][i % 5],
          year: i < 10 ? 2024 : 2023,
          image: `https://api.dicebear.com/7.x/avataaars/svg?seed=user${i + 1}`,
        },
      })
    })
  )

  // Create 20 events
  const events = await Promise.all(
    Array.from({ length: 20 }, async (_, i) => {
      const eventDate = new Date()
      eventDate.setDate(eventDate.getDate() + i + 1) // Events spread across next 20 days
      
      return prisma.event.create({
        data: {
          title: `Event ${i + 1}`,
          description: `This is a detailed description for Event ${i + 1}. Join us for an exciting experience!`,
          date: eventDate,
          startTime: '09:00',
          endTime: '17:00',
          location: `Location ${i + 1}`,
          venue: `Venue ${i + 1}`,
          category: ['Workshop', 'Conference', 'Seminar', 'Hackathon', 'Networking'][i % 5],
          department: ['Computer Science', 'Engineering', 'Business', 'Arts', 'Science'][i % 5],
          tags: ['tech', 'education', 'networking', 'career', 'development'].join(','),
          images: [
            'https://picsum.photos/800/400',
            'https://picsum.photos/800/401',
          ].join(','),
          contactEmail: `event${i + 1}@example.com`,
          contactPhone: `+1234567890${i}`,
          eventType: [EventType.IN_PERSON, EventType.ONLINE, EventType.HYBRID][i % 3],
          isPublic: true,
          requiresApproval: i % 2 === 0,
          allowFeedback: true,
          organizerInfo: true,
          featured: i < 5,
          capacity: 50 + (i * 10),
          registrationDeadline: new Date(eventDate.getTime() - 24 * 60 * 60 * 1000), // 1 day before event
          approvalStatus: [ApprovalStatus.PENDING, ApprovalStatus.APPROVED, ApprovalStatus.REJECTED][i % 3],
          createdById: users[i % 20].id,
        },
      })
    })
  )

  // Create three specific events for notification testing
  await Promise.all([
    prisma.event.create({
      data: {
        title: "AI and Machine Learning Workshop",
        description: "Join us for an intensive workshop on AI and Machine Learning fundamentals. Learn about neural networks, deep learning, and practical applications.",
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        startTime: "10:00",
        endTime: "16:00",
        location: "Computer Science Building",
        venue: "Room 301",
        category: "Workshop",
        department: "Computer Science",
        tags: "ai,ml,machine-learning,workshop",
        images: "https://picsum.photos/800/400",
        contactEmail: "ai-workshop@astu.edu",
        contactPhone: "+1234567890",
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
        capacity: 30,
        registrationDeadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        approvalStatus: ApprovalStatus.APPROVED,
        createdById: users[1].id, // Using the second user (likely an EVENT_ORGANIZER)
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
        title: "Virtual Career Fair 2025",
        description: "Connect with top employers in a virtual environment. Perfect for students seeking internships and full-time positions.",
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        startTime: "09:00",
        endTime: "17:00",
        location: "Online",
        category: "Career",
        department: "Career Services",
        tags: "career,jobs,internships,networking",
        images: "https://picsum.photos/800/401",
        contactEmail: "career-fair@astu.edu",
        contactPhone: "+1234567891",
        eventType: EventType.ONLINE,
        isPublic: true,
        requiresApproval: false,
        allowFeedback: true,
        organizerInfo: true,
        featured: true,
        capacity: 200,
        registrationDeadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), // 12 days from now
        approvalStatus: ApprovalStatus.APPROVED,
        createdById: users[2].id, // Using the third user
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
        title: "Cultural Festival 2025",
        description: "Experience the rich diversity of our university community through music, dance, food, and cultural performances.",
        date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
        startTime: "11:00",
        endTime: "20:00",
        location: "University Square",
        venue: "Main Stage",
        category: "Cultural",
        department: "Student Affairs",
        tags: "cultural,festival,music,dance,food",
        images: "https://picsum.photos/800/402",
        contactEmail: "cultural-fest@astu.edu",
        contactPhone: "+1234567892",
        eventType: EventType.HYBRID,
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
        capacity: 500,
        registrationDeadline: new Date(Date.now() + 19 * 24 * 60 * 60 * 1000), // 19 days from now
        approvalStatus: ApprovalStatus.APPROVED,
        createdById: users[3].id, // Using the fourth user
      },
    }),
  ])

  // Create 20 registrations
  await Promise.all(
    Array.from({ length: 20 }, async (_, i) => {
      return prisma.registration.create({
        data: {
          eventId: events[i % 20].id,
          userId: users[i % 20].id,
          status: [RegistrationStatus.PENDING, RegistrationStatus.CONFIRMED, RegistrationStatus.CANCELLED, RegistrationStatus.WAITLISTED][i % 4],
        },
      })
    })
  )

  // Create 20 feedback entries
  await Promise.all(
    Array.from({ length: 20 }, async (_, i) => {
      return prisma.feedback.create({
        data: {
          userId: users[i % 20].id,
          eventId: events[i % 20].id,
          rating: (i % 5) + 1, // Ratings from 1 to 5
          feedback: `This is feedback ${i + 1} for the event. ${i % 2 === 0 ? 'Great experience!' : 'Could be improved.'}`,
          email: users[i % 20].email,
          wasHelpful: i % 2 === 0,
        },
      })
    })
  )

  // Create test notifications for different scenarios
  await Promise.all([
    // Event Created notifications
    ...users.slice(10, 20).map((student) => // For all students
      prisma.notification.create({
        data: {
          userId: student.id,
          title: "New Event Created",
          message: "AI and Machine Learning Workshop has been created. Check it out!",
          type: NotificationType.EVENT_CREATED,
          read: false,
        },
      })
    ),
    // Event Updated notifications
    ...users.slice(10, 15).map((student) => // For first 5 students
      prisma.notification.create({
        data: {
          userId: student.id,
          title: "Event Updated",
          message: "Virtual Career Fair 2025 has been updated with new information.",
          type: NotificationType.EVENT_UPDATED,
          read: false,
        },
      })
    ),
    // Registration Status notifications
    ...users.slice(15, 18).map((student) => // For 3 students
      prisma.notification.create({
        data: {
          userId: student.id,
          title: "Registration Status Changed",
          message: "Your registration for Cultural Festival 2025 has been confirmed.",
          type: NotificationType.REGISTRATION_STATUS,
          read: true, // Some notifications are already read
        },
      })
    ),
    // System notifications
    ...users.slice(10, 20).map((student) => // For all students
      prisma.notification.create({
        data: {
          userId: student.id,
          title: "System Maintenance",
          message: "The system will be down for maintenance on Sunday, 2:00 AM - 4:00 AM.",
          type: NotificationType.SYSTEM,
          read: false,
        },
      })
    ),
  ])

  console.log('Database has been seeded. 🌱')
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 
