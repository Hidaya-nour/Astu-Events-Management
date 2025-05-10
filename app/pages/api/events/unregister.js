import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    try {
      const { eventId, userId } = req.body;
      await prisma.eventAttendee.delete({
        where: {
          eventId_userId: {
            eventId: parseInt(eventId),
            userId: parseInt(userId),
          },
        },
      });
      res.status(200).json({ message: 'Successfully unregistered from event' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to unregister from event' });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 