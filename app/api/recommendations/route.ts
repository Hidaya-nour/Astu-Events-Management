import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const FASTAPI_URL = "http://127.0.0.1:8000";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Fetching events for user:", session.user.id);

    // Get all events the user hasn't registered for
    const events = await prisma.event.findMany({
      where: {
        approvalStatus: "APPROVED",
        NOT: {
          registrations: {
            some: {
              userId: session.user.id,
              status: "CONFIRMED"
            }
          }
        }
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            registrations: true
          }
        }
      },
      orderBy: {
        date: "desc"
      }
    });

    console.log("Found events:", events.length);

    // Transform events to match the expected format
    const transformedEvents = events.map(event => ({
      id: event.id,
      title: event.title,
      description: event.description,
      date: event.date,
      startTime: event.startTime,
      endTime: event.endTime,
      location: event.location,
      venue: event.venue,
      category: event.category,
      images: event.images ? event.images.split(',')[0] : null,
      capacity: event.capacity,
      organizer: {
        id: event.createdBy.id,
        name: event.createdBy.name,
        avatar: event.createdBy.image,
      },
      _count: {
        registrations: event._count.registrations
      }
    }));

    try {
      // Try to fetch recommendations from the FastAPI server
      const recommendationsUrl = `${FASTAPI_URL}/recommend/${session.user.id}?${new URLSearchParams(
        transformedEvents.map(event => ['event_ids', event.id])
      ).toString()}`;
      
      console.log("Fetching recommendations from:", recommendationsUrl);
      
      const recommendationsResponse = await fetch(recommendationsUrl);

      if (recommendationsResponse.ok) {
        const recommendedEventIds = await recommendationsResponse.json();
        console.log("Received recommendations:", recommendedEventIds);
        
        // Get full event details for recommended events
        const recommendedEvents = transformedEvents.filter((event: any) => 
          recommendedEventIds.some((rec: any) => rec.eventId === event.id)
        );
        
        console.log("Filtered recommended events:", recommendedEvents.length);
        return NextResponse.json({ events: recommendedEvents });
      } else {
        console.warn("FastAPI server returned error:", await recommendationsResponse.text());
      }
    } catch (error) {
      console.warn("FastAPI server not available, using fallback recommendations:", error);
    }

    // Fallback: Return events sorted by date (most recent first)
    const fallbackRecommendations = transformedEvents.slice(0, 5); // Return top 5 most recent events
    console.log("Using fallback recommendations:", fallbackRecommendations.length);

    return NextResponse.json({ events: fallbackRecommendations });
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return NextResponse.json(
      { error: "Failed to fetch recommendations" },
      { status: 500 }
    );
  }
} 