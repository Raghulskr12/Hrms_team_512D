import { Router } from 'express';
import authRoutes from './auth.routes';
import profileRoutes from './profile.routes';
import employeeRoutes from './employee.routes';
import attendanceRoutes from './attendance.routes';
import leaveRoutes from './leave.routes';
import payrollRoutes from './payroll.routes';
import notificationRoutes from './notification.routes';
import reportRoutes from './report.routes';
import documentRoutes from './document.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/employees', employeeRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/leaves', leaveRoutes);
router.use('/payroll', payrollRoutes);
router.use('/notifications', notificationRoutes);
router.use('/reports', reportRoutes);
router.use('/documents', documentRoutes);

export default router;
