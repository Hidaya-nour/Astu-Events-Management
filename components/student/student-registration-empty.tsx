import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar } from "lucide-react"
import Link from "next/link"

interface StudentRegistrationsEmptyProps {
  message: string
  buttonText: string
  buttonLink: string
}

export function StudentRegistrationsEmpty({ message, buttonText, buttonLink }: StudentRegistrationsEmptyProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col items-center justify-center text-center py-10">
          <div className="bg-muted p-3 rounded-full">
            <Calendar className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-medium">No Registrations Found</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-sm">{message}</p>
          <Button className="mt-4" asChild>
            <Link href={buttonLink}>{buttonText}</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
