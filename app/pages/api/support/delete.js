import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    try {
      const { id } = req.body;
      await prisma.supportTicket.delete({
        where: { id: parseInt(id) },
      });
      res.status(200).json({ message: 'Support ticket deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete support ticket' });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 