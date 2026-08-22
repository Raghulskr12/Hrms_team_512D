import { NotificationRepository } from '../repositories/notification.repository';

export class NotificationService {
  static async getUserNotifications(userId: string) {
    return NotificationRepository.findByUserId(userId);
  }

  static async markAsRead(id: string, userId: string) {
    return NotificationRepository.markAsRead(id, userId);
  }

  static async markAllAsRead(userId: string) {
    return NotificationRepository.markAllAsRead(userId);
  }
}
