import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

const feedbackSchema = z.object({
  eventId: z.string(),
  rating: z.number().min(1, "Please provide a rating").max(5),
  comment: z.string().min(10, "Feedback must be at least 10 characters").max(500, "Feedback cannot exceed 500 characters"),
  email: z.string().email("Please enter a valid email").optional().or(z.literal("")),
  wasHelpful: z.boolean().default(false),
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      console.log("No session found")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    console.log("Received feedback data:", body)
    
    const validatedData = feedbackSchema.parse(body)
    console.log("Validated data:", validatedData)

    // Check if user has already submitted feedback for this event
    const existingFeedback = await prisma.feedback.findFirst({
      where: {
        eventId: validatedData.eventId,
        userId: session.user.id,
      },
    })

    if (existingFeedback) {
      console.log("User has already submitted feedback")
      return NextResponse.json(
        { error: "You have already submitted feedback for this event" },
        { status: 400 }
      )
    }

    const feedbackData = {
      eventId: validatedData.eventId,
      userId: session.user.id,
      rating: validatedData.rating,
      comment: validatedData.comment,
      wasHelpful: validatedData.wasHelpful,
      email: validatedData.email,
    };
    const feedback = await prisma.feedback.create({
      data: feedbackData,
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

    console.log("Feedback created successfully:", feedback)
    return NextResponse.json(feedback, { status: 201 })
  } catch (error) {
    console.error("Feedback submission error:", error)
    if (error instanceof z.ZodError) {
      console.log("Validation error details:", error.errors)
      return NextResponse.json(
        { error: "Invalid feedback data", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Failed to submit feedback" },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const eventId = searchParams.get("eventId")

    if (!eventId) {
      return NextResponse.json(
        { error: "Event ID is required" },
        { status: 400 }
      )
    }

    const [feedback, stats] = await Promise.all([
      prisma.feedback.findMany({
        where: { eventId },
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.feedback.aggregate({
        where: { eventId },
        _avg: { rating: true },
        _count: true,
      }),
    ])

    const totalRatings = stats._count
    const averageRating = stats._avg.rating || 0
    const helpfulCount = feedback.filter(f => f.wasHelpful).length

    return NextResponse.json({
      feedback,
      stats: {
        totalRatings,
        averageRating: Number(averageRating.toFixed(1)),
        helpfulCount,
        helpfulPercentage: totalRatings > 0
          ? Math.round((helpfulCount / totalRatings) * 100)
          : 0,
      },
    })
  } catch (error) {
    console.error("Error fetching feedback:", error)
    return NextResponse.json(
      { error: "Failed to fetch feedback" },
      { status: 500 }
    )
  }
} 