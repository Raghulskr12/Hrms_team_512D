import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.get('/', requireAuth, NotificationController.getAll);
router.patch('/:id/read', requireAuth, NotificationController.markRead);
router.patch('/read-all', requireAuth, NotificationController.markAllRead);

export default router;
