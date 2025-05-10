import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    try {
      const { id } = req.body;
      const eventRequest = await prisma.eventRequest.update({
        where: { id: parseInt(id) },
        data: { status: 'APPROVED' },
      });
      res.status(200).json(eventRequest);
    } catch (error) {
      res.status(500).json({ error: 'Failed to approve event request' });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 