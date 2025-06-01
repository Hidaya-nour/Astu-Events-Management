import { PrismaClient, NotificationType } from "@prisma/client"
import { prisma } from "@/lib/prisma"

interface CreateNotificationParams {
  userId: string
  title: string
  message: string
  type: NotificationType
}

export async function createNotification({
  userId,
  title,
  message,
  type,
}: CreateNotificationParams) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
      },
    })
    return notification
  } catch (error) {
    console.error("Error creating notification:", error)
    throw error
  }
}

// Helper functions for common notification types
export async function createEventRegistrationNotification(
  userId: string,
  eventTitle: string
) {
  return createNotification({
    userId,
    title: "Event Registration",
    message: `You have successfully registered for "${eventTitle}"`,
    type: NotificationType.EVENT_REGISTRATION,
  })
}

export async function createEventUpdateNotification(
  userId: string,
  eventTitle: string
) {
  return createNotification({
    userId,
    title: "Event Update",
    message: `The event "${eventTitle}" has been updated`,
    type: NotificationType.EVENT_UPDATE,
  })
}

export async function createRegistrationStatusNotification(
  userId: string,
  eventTitle: string,
  status: string
) {
  return createNotification({
    userId,
    title: "Registration Status Update",
    message: `Your registration for "${eventTitle}" has been ${status.toLowerCase()}`,
    type: NotificationType.REGISTRATION_STATUS,
  })
}

export async function createSystemNotification(
  userId: string,
  title: string,
  message: string
) {
  return createNotification({
    userId,
    title,
    message,
    type: NotificationType.SYSTEM,
  })
} 