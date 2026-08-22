import { Router } from 'express';
import { AttendanceController } from '../controllers/attendance.controller';
import { requireAuth, requireAdminOrHR } from '../middleware/auth.middleware';

const router = Router();

router.post('/check-in', requireAuth, AttendanceController.checkIn);
router.post('/check-out', requireAuth, AttendanceController.checkOut);
router.get('/today', requireAuth, AttendanceController.getToday);
router.get('/my-history', requireAuth, AttendanceController.getOwnHistory);
router.get('/', requireAuth, requireAdminOrHR, AttendanceController.getAll);
router.put('/:id', requireAuth, requireAdminOrHR, AttendanceController.adminUpdate);

export default router;
