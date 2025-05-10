import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { title, description, date, userId } = req.body;
      const eventRequest = await prisma.eventRequest.create({
        data: {
          title,
          description,
          date: new Date(date),
          userId: parseInt(userId),
          status: 'PENDING',
        },
      });
      res.status(201).json(eventRequest);
    } catch (error) {
      res.status(500).json({ error: 'Failed to request event' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 