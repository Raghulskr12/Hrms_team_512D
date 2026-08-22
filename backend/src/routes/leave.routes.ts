import { Router } from 'express';
import { LeaveController } from '../controllers/leave.controller';
import { requireAuth, requireAdminOrHR } from '../middleware/auth.middleware';

const router = Router();

router.get('/balances', requireAuth, LeaveController.getBalances);
router.post('/apply', requireAuth, LeaveController.applyLeave);
router.get('/my-requests', requireAuth, LeaveController.getOwnRequests);
router.get('/', requireAuth, requireAdminOrHR, LeaveController.getAllRequests);
router.patch('/:id/approve', requireAuth, requireAdminOrHR, LeaveController.approve);
router.patch('/:id/reject', requireAuth, requireAdminOrHR, LeaveController.reject);

export default router;
