import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import { NotificationService } from '../services/notification.service';
import { sendSuccess } from '../utils/response';

export class NotificationController {
  static async getAll(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const list = await NotificationService.getUserNotifications(req.user!.userId);
      return sendSuccess(res, 200, 'Notifications retrieved', list);
    } catch (error) {
      return next(error);
    }
  }

  static async markRead(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      await NotificationService.markAsRead(id, req.user!.userId);
      return sendSuccess(res, 200, 'Notification marked as read');
    } catch (error) {
      return next(error);
    }
  }

  static async markAllRead(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await NotificationService.markAllAsRead(req.user!.userId);
      return sendSuccess(res, 200, 'All notifications marked as read');
    } catch (error) {
      return next(error);
    }
  }
}
