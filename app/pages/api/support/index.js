import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const tickets = await prisma.supportTicket.findMany();
      res.status(200).json(tickets);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch support tickets' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 