import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, MapPin, Users, Heart } from "lucide-react"
import { useState } from "react"
import { toast } from "react-toastify"

interface EventCardProps {
  event: {
    id: string
    title: string
    description: string
    date: string
    startTime: string
    endTime?: string
    location: string
    venue?: string
    organizer: {
      id: string
      name: string
      avatar?: string
    }
    category: string
    images: string
    capacity: number
    _count?: {
      registrations: number
    }
    isRegistered?: boolean
    registrationStatus?: "PENDING" | "CONFIRMED" | "CANCELLED" | "WAITLISTED"
    isFavorite?: boolean
  }
  variant?: "default" | "compact"
  onRegister?: (eventId: string) => Promise<void>
  onCancelRegistration?: (eventId: string) => Promise<void>
}

export function EventCard({ event, variant = "default", onRegister, onCancelRegistration }: EventCardProps) {
  const [isRegistering, setIsRegistering] = useState(false)

  const getImageUrl = (images: string): string => {
    try {
      // If it's a stringified array, parse it
      const parsed = JSON.parse(images);
  
      // If it's an array, return the first image
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed[0];
      }
  
      // If it's a string inside the parsed result
      if (typeof parsed === 'string') {
        return parsed;
      }
    } catch {
      // Fallback for comma-separated or plain strings
      if (images.includes(',')) {
        return images.split(',')[0];
      }
      return images;
    }
  
    return "/placeholder.svg";
  };
  

  const handleAction = async () => {
    if (event.isRegistered) {
      if (!onCancelRegistration) return;
      try {
        setIsRegistering(true);
        await onCancelRegistration(event.id);
        toast.success("Successfully cancelled registration");
      } catch (error) {
        toast.error("Failed to cancel registration");
      } finally {
        setIsRegistering(false);
      }
    } else {
      if (!onRegister) return;
      try {
        setIsRegistering(true);
        await onRegister(event.id);
        toast.success("Successfully registered for event");
      } catch (error) {
        toast.error("Failed to register for event");
      } finally {
        setIsRegistering(false);
      }
    }
  };

  const getActionButtonText = () => {
    if (isRegistering) return "Processing...";
    if (event.isRegistered) {
      switch (event.registrationStatus) {
        case "CONFIRMED":
          return "Cancel Registration";
        case "PENDING":
          return "Pending";
        case "WAITLISTED":
          return "Waitlisted";
        case "CANCELLED":
          return "Cancelled";
        default:
          return "Cancel Registration";
      }
    }
    return "Register";
  };

  const getActionButtonVariant = () => {
    if (event.isRegistered) {
      switch (event.registrationStatus) {
        case "CONFIRMED":
          return "outline";
        case "PENDING":
          return "secondary";
        case "WAITLISTED":
          return "secondary";
        case "CANCELLED":
          return "destructive";
        default:
          return "outline";
      }
    }
    return "default";
  };

  if (variant === "compact") {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <img
              src={getImageUrl(event.images) || null}
              alt={event.title}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-sm truncate">{event.title}</h3>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <Heart className={`h-3 w-3 ${event.isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                </Button>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                <Calendar className="h-3 w-3" />
                <span>{new Date(event.date).toLocaleDateString()}</span>
                <Clock className="h-3 w-3" />
                <span>{event.startTime}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <MapPin className="h-3 w-3" />
                <span className="truncate">{event.location}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        <div className="relative">
          <img
            src={getImageUrl(event.images)}
            alt={event.title}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <Badge className="absolute top-2 left-2" variant="secondary">
            {event.category}
          </Badge>
          <Button variant="ghost" size="sm" className="absolute top-2 right-2 h-8 w-8 p-0 bg-white/80 hover:bg-white">
            <Heart className={`h-4 w-4 ${event.isFavorite ? "fill-red-500 text-red-500" : ""}`} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{event.title}</h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{event.description}</p>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{new Date(event.date).toLocaleDateString()}</span>
            <Clock className="h-4 w-4 text-muted-foreground ml-2" />
            <span>{event.startTime}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="truncate">{event.location}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={event.organizer?.avatar || "/placeholder.svg"} />
                <AvatarFallback>{event.organizer?.name?.charAt(0) || "?"}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">{event.organizer?.name || "Unknown Organizer"}</span>
            </div>

            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>
                {event._count?.registrations || 0}/{event.capacity}
              </span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full" 
          variant={getActionButtonVariant()}
          onClick={handleAction}
          disabled={isRegistering}
        >
          {getActionButtonText()}
        </Button>
      </CardFooter>
    </Card>
  )
}
