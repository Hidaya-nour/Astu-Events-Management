import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    try {
      const { id } = req.body;
      const eventRequest = await prisma.eventRequest.update({
        where: { id: parseInt(id) },
        data: { status: 'REJECTED' },
      });
      res.status(200).json(eventRequest);
    } catch (error) {
      res.status(500).json({ error: 'Failed to reject event request' });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 