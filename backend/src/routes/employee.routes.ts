import { Router } from 'express';
import { EmployeeController } from '../controllers/employee.controller';
import { requireAuth, requireAdminOrHR } from '../middleware/auth.middleware';

const router = Router();

router.get('/', requireAuth, requireAdminOrHR, EmployeeController.getAll);
router.get('/:id', requireAuth, requireAdminOrHR, EmployeeController.getById);
router.put('/:id', requireAuth, requireAdminOrHR, EmployeeController.update);
router.get('/:id/bank-details', requireAuth, EmployeeController.getBankDetails);
router.put('/:id/bank-details', requireAuth, EmployeeController.updateBankDetails);

export default router;
