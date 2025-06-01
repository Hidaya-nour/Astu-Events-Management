import { prisma } from "@/lib/prisma"

export interface CreateFeedbackData {
  eventId: string
  userId: string
  rating: number
  feedback: string
  email?: string
  wasHelpful: boolean
}

export interface FeedbackWithEvent {
  id: string
  rating: number
  feedback: string
  email?: string
  wasHelpful: boolean
  createdAt: Date
  event: {
    id: string
    title: string
  }
}

export const feedbackService = {
  async create(data: CreateFeedbackData) {
    return prisma.feedback.create({
      data: {
        eventId: data.eventId,
        userId: data.userId,
        rating: data.rating,
        feedback: data.feedback,
        email: data.email,
        wasHelpful: data.wasHelpful,
      },
      include: {
        event: {
          select: {
            id: true,
            title: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })
  },

  async getByEventId(eventId: string) {
    return prisma.feedback.findMany({
      where: { eventId },
      orderBy: { createdAt: "desc" },
      include: {
        event: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    })
  },

  async getEventStats(eventId: string) {
    const feedback = await prisma.feedback.findMany({
      where: { eventId },
      select: { rating: true, wasHelpful: true },
    })

    const totalRatings = feedback.length
    const averageRating = totalRatings > 0
      ? feedback.reduce((sum, f) => sum + f.rating, 0) / totalRatings
      : 0
    const helpfulCount = feedback.filter(f => f.wasHelpful).length

    return {
      totalRatings,
      averageRating: Number(averageRating.toFixed(1)),
      helpfulCount,
      helpfulPercentage: totalRatings > 0
        ? Math.round((helpfulCount / totalRatings) * 100)
        : 0,
    }
  },
} 