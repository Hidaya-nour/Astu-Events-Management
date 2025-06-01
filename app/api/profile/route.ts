import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const profileSchema = z.object({
  name: z.string().min(2),
  bio: z.string().max(160),
  location: z.string().min(2),
  website: z.string().url().optional().or(z.literal("")),
  department: z.string().min(2),
})

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        department: true,
        image: true,
        bio: true,
        location: true,
        website: true,
      },
    })

    if (!user) {
      return new NextResponse("User not found", { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("[PROFILE_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const validatedData = profileSchema.parse(body)

    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name: validatedData.name,
        department: validatedData.department,
        bio: validatedData.bio,
        location: validatedData.location,
        website: validatedData.website,
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse("Invalid request data", { status: 422 })
    }

    console.error("[PROFILE_PATCH]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 