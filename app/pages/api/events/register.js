import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { eventId, userId } = req.body;
      const attendee = await prisma.eventAttendee.create({
        data: {
          eventId: parseInt(eventId),
          userId: parseInt(userId),
        },
      });
      res.status(201).json(attendee);
    } catch (error) {
      res.status(500).json({ error: 'Failed to register for event' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 