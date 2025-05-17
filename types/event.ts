export interface Event {
  id: string
  title: string
  description: string
  date: string
  startTime: string
  endTime: string
  location: string
  category: string
  eventType: string
  approvalStatus: string
  capacity: number
  _count?: {
    registrations: number
  }
  organizer?: {
    id: string
    name: string
    avatar?: string
  }
  createdAt?: string
} 