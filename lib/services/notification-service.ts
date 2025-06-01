import { prisma } from "@/lib/prisma"
import { NotificationType } from "@prisma/client"

export interface CreateNotificationData {
  userId: string
  title: string
  message: string
  type: NotificationType
}

export const notificationService = {
  async create(data: CreateNotificationData) {
    return prisma.notification.create({
      data: {
        userId: data.userId,
        title: data.title,
        message: data.message,
        type: data.type,
        read: false,
      },
    })
  },

  async getByUserId(userId: string) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })
  },

  async markAsRead(id: string) {
    return prisma.notification.update({
      where: { id },
      data: { read: true },
    })
  },

  async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    })
  },

  async getUnreadCount(userId: string) {
    return prisma.notification.count({
      where: { userId, read: false },
    })
  },
} 