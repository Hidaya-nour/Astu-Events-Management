// import { PrismaClient } from '@prisma/client'
// import { addDays } from 'date-fns'

// const prisma = new PrismaClient()

// async function main() {
//   // Create 10 users
//   const users = await Promise.all(
//     Array.from({ length: 10 }).map((_, i) =>
//       prisma.user.create({
//         data: {
//           name: `User ${i + 1}`,
//           email: `user${i + 1}@example.com`,
//           password: 'hashedpassword',
//           role: i === 0 ? 'ADMIN' : i <= 3 ? 'EVENT_ORGANIZER' : 'STUDENT',
//           department: ['CS', 'EE', 'ME', 'CE', 'BA'][i % 5],
//           year: (i % 4) + 1,
//         },
//       })
//     )
//   )

//   // Create 10 events
//   await Promise.all(
//     Array.from({ length: 10 }).map((_, i) =>
//       prisma.event.create({
//         data: {
//           title: `Event ${i + 1}`,
//           description: `This is the description for event ${i + 1}.`,
//           date: addDays(new Date(), i + 1),
//           startTime: '10:00 AM',
//           endTime: '12:00 PM',
//           location: `Location ${i + 1}`,
//           venue: `Hall ${i + 1}`,
//           category: ['Tech', 'Art', 'Science', 'Business'][i % 4],
//           department: ['CS', 'EE', 'ME'][i % 3],
//           tags: `tag${i + 1},tag${i + 2}`,
//           images: `https://example.com/event${i + 1}.jpg`,
//           contactEmail: `organizer${i + 1}@example.com`,
//           contactPhone: `123-456-789${i}`,
//           eventType: ['IN_PERSON', 'ONLINE', 'HYBRID'][i % 3],
//           isPublic: true,
//           requiresApproval: false,
//           allowFeedback: true,
//           organizerInfo: true,
//           featured: i % 2 === 0,
//           capacity: 100 + i * 10,
//           registrationDeadline: addDays(new Date(), i),
//           approvalStatus: ['PENDING', 'APPROVED', 'REJECTED'][i % 3],
//           createdById: users[i % users.length].id,
//         },
//       })
//     )
//   )

//   console.log('Seeding complete.')
// }

// main()
//   .catch(e => {
//     console.error(e)
//     process.exit(1)
//   })
//   .finally(async () => {
//     await prisma.$disconnect()
//   })
