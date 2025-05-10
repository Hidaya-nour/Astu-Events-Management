import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const ticket = await prisma.supportTicket.findUnique({
        where: { id: parseInt(id) },
      });
      if (ticket) {
        res.status(200).json(ticket);
      } else {
        res.status(404).json({ error: 'Support ticket not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch support ticket' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 