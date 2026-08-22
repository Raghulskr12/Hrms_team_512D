import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import { PayrollService } from '../services/payroll.service';
import { updateSalarySchema } from '../validators/payroll.validator';
import { sendSuccess } from '../utils/response';

export class PayrollController {
  static async getOwnSalary(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const salary = await PayrollService.getOwnSalary(req.user!.userId);
      return sendSuccess(res, 200, 'Salary details retrieved', salary);
    } catch (error) {
      return next(error);
    }
  }

  static async getOwnSalaryHistory(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const history = await PayrollService.getOwnSalaryHistory(req.user!.userId);
      return sendSuccess(res, 200, 'Salary history retrieved', history);
    } catch (error) {
      return next(error);
    }
  }

  static async getAllPayroll(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const list = await PayrollService.getAllPayroll();
      return sendSuccess(res, 200, 'Payroll directory retrieved', list);
    } catch (error) {
      return next(error);
    }
  }

  static async getEmployeeSalary(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.employeeId;
      const salary = await PayrollService.getEmployeeSalary(id);
      return sendSuccess(res, 200, 'Employee salary structure retrieved', salary);
    } catch (error) {
      return next(error);
    }
  }

  static async updateEmployeeSalary(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.employeeId;
      const validated = updateSalarySchema.parse(req.body);
      const updated = await PayrollService.updateEmployeeSalary(id, validated);
      return sendSuccess(res, 200, 'Salary structure updated successfully', updated);
    } catch (error) {
      return next(error);
    }
  }
}
