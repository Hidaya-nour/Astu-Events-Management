import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const eventRequest = await prisma.eventRequest.findUnique({
        where: { id: parseInt(id) },
        include: { user: true },
      });
      if (eventRequest) {
        res.status(200).json(eventRequest);
      } else {
        res.status(404).json({ error: 'Event request not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch event request' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 