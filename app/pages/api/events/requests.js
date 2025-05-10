import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const eventRequests = await prisma.eventRequest.findMany({
        include: { user: true },
      });
      res.status(200).json(eventRequests);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch event requests' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 