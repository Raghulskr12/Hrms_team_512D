import { Router } from 'express';
import { ReportController } from '../controllers/report.controller';
import { requireAuth, requireAdminOrHR } from '../middleware/auth.middleware';

const router = Router();

router.get('/attendance', requireAuth, requireAdminOrHR, ReportController.getAttendanceReport);
router.get('/leaves', requireAuth, requireAdminOrHR, ReportController.getLeaveReport);
router.get('/payroll', requireAuth, requireAdminOrHR, ReportController.getPayrollReport);

export default router;
