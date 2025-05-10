import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { title, description, userId } = req.body;
      const ticket = await prisma.supportTicket.create({
        data: {
          title,
          description,
          userId: parseInt(userId),
        },
      });
      res.status(201).json(ticket);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create support ticket' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 