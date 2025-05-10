import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    try {
      const { id, title, description, status } = req.body;
      const ticket = await prisma.supportTicket.update({
        where: { id: parseInt(id) },
        data: {
          title,
          description,
          status,
        },
      });
      res.status(200).json(ticket);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update support ticket' });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 