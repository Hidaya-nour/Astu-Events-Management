import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { eventId } = req.query;

  if (req.method === 'GET') {
    try {
      const attendees = await prisma.eventAttendee.findMany({
        where: { eventId: parseInt(eventId) },
        include: { user: true },
      });
      res.status(200).json(attendees);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch event attendees' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 