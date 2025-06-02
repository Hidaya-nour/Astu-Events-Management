import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Clean existing data
  await prisma.feedback.deleteMany()
  await prisma.registration.deleteMany()
  await prisma.event.deleteMany()
  await prisma.user.deleteMany()

  // Create organizers
  const hashedPassword = await hash('password123', 12)
  
  const organizers = await Promise.all(
    Array.from({ length: 6 }, (_, i) => 
      prisma.user.create({
        data: {
          email: `organizer${i + 1}@astu.edu.et`,
          name: `Organizer ${i + 1}`,
          password: hashedPassword,
          role: 'EVENT_ORGANIZER',
          department: ['Software Engineering', 'Computer Science', 'Information Technology', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering'][i]
        }
      })
    )
  )

  // Create students
  const students = await Promise.all(
    Array.from({ length: 18 }, (_, i) => 
      prisma.user.create({
        data: {
          email: `student${i + 1}@astu.edu.et`,
          name: `Student ${i + 1}`,
          password: hashedPassword,
          role: 'STUDENT',
          department: ['Software Engineering', 'Computer Science', 'Information Technology', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering'][i % 6],
          year: Math.floor(Math.random() * 4) + 1
        }
      })
    )
  )

  // Event categories and types
  const categories = ['Technical Workshop', 'Career Fair', 'Seminar', 'Competition', 'Cultural Event', 'Sports']
  const eventTypes = ['IN_PERSON', 'ONLINE', 'HYBRID'] as const
  const locations = ['Main Auditorium', 'Tech Hub', 'Sports Complex', 'Innovation Center', 'Library Hall', 'Conference Room']
  const venues = ['Room 101', 'Room 202', 'Main Hall', 'Lab 1', 'Meeting Room A', 'Outdoor Field']
  const registrationStatuses = ['PENDING', 'CONFIRMED', 'WAITLISTED'] as const

  // Create events
  const events = await Promise.all(
    Array.from({ length: 18 }, (_, i) => {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() + i * 2) // Events spread over next 36 days

      return prisma.event.create({
        data: {
          title: `${categories[i % 6]} ${i + 1}`,
          description: `Join us for an exciting ${categories[i % 6].toLowerCase()} event focused on innovation and learning.`,
          date: startDate,
          startTime: '09:00',
          endTime: '17:00',
          location: locations[i % 6],
          venue: venues[i % 6],
          category: categories[i % 6],
          department: ['Software Engineering', 'Computer Science', 'Information Technology', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering'][i % 6],
          tags: `technology,education,innovation`,
          images: null,
          contactEmail: `organizer${(i % 6) + 1}@astu.edu.et`,
          contactPhone: `+251911${100000 + i}`,
          eventType: eventTypes[i % 3],
          isPublic: true,
          requiresApproval: i % 3 === 0,
          allowFeedback: true,
          organizerInfo: true,
          featured: i < 6,
          capacity: 50 + (i * 10),
          registrationDeadline: new Date(startDate.getTime() - 24 * 60 * 60 * 1000), // 1 day before event
          approvalStatus: 'APPROVED',
          createdById: organizers[i % 6].id
        }
      })
    })
  )

  // Create registrations (3 registrations per event)
  const registrations = await Promise.all(
    events.flatMap(event => 
      Array.from({ length: 3 }, (_, i) => {
        const studentIndex = (events.indexOf(event) + i) % students.length
        return prisma.registration.create({
          data: {
            eventId: event.id,
            userId: students[studentIndex].id,
            status: registrationStatuses[i % 3],
            createdAt: new Date(),
            updatedAt: new Date()
          }
        })
      })
    )
  )

  // Create feedback (1 feedback per completed registration)
  const feedbacks = await Promise.all(
    registrations
      .filter(reg => reg.status === 'CONFIRMED')
      .map(registration => 
        prisma.feedback.create({
          data: {
            userId: registration.userId,
            eventId: registration.eventId,
            rating: Math.floor(Math.random() * 5) + 1,
            comment: `Great event! Really enjoyed the content and organization.`,
            createdAt: new Date()
          }
        })
      )
  )

  console.log({
    organizers: organizers.length,
    students: students.length,
    events: events.length,
    registrations: registrations.length,
    feedbacks: feedbacks.length
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 