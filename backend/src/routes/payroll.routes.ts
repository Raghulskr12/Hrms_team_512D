import { Router } from 'express';
import { PayrollController } from '../controllers/payroll.controller';
import { requireAuth, requireAdminOrHR } from '../middleware/auth.middleware';

const router = Router();

router.get('/my-salary', requireAuth, PayrollController.getOwnSalary);
router.get('/my-history', requireAuth, PayrollController.getOwnSalaryHistory);
router.get('/', requireAuth, requireAdminOrHR, PayrollController.getAllPayroll);
router.get('/:employeeId', requireAuth, requireAdminOrHR, PayrollController.getEmployeeSalary);
router.put('/:employeeId', requireAuth, requireAdminOrHR, PayrollController.updateEmployeeSalary);

export default router;
