import { NextResponse } from "next/server"
import { z } from "zod"
import { feedbackService } from "@/lib/services/feedback-service"

const feedbackSchema = z.object({
  eventId: z.string(),
  rating: z.number().min(1).max(5),
  feedback: z.string().min(10).max(500),
  email: z.string().email().optional(),
  wasHelpful: z.boolean(),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const validatedData = feedbackSchema.parse(body)

    const feedback = await feedbackService.create(validatedData)

    return NextResponse.json(feedback, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid feedback data", details: error.errors },
        { status: 400 }
      )
    }

    console.error("Feedback submission error:", error)
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
      feedbackService.getByEventId(eventId),
      feedbackService.getEventStats(eventId),
    ])

    return NextResponse.json({ feedback, stats })
  } catch (error) {
    console.error("Error fetching feedback:", error)
    return NextResponse.json(
      { error: "Failed to fetch feedback" },
      { status: 500 }
    )
  }
} 