import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import { EmployeeService } from '../services/employee.service';
import { adminUpdateEmployeeSchema, updateBankDetailsSchema } from '../validators/employee.validator';
import { sendSuccess } from '../utils/response';

export class EmployeeController {
  static async getAll(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const search = req.query.search as string;
      const department = req.query.department as string;
      const status = req.query.status as string;
      const page = parseInt(req.query.page as string || '1', 10);
      const limit = parseInt(req.query.limit as string || '50', 10);

      const skip = (page - 1) * limit;

      const result = await EmployeeService.getAllEmployees({
        search,
        department,
        status,
        skip,
        take: limit,
      });

      return sendSuccess(res, 200, 'Employees retrieved successfully', result);
    } catch (error) {
      return next(error);
    }
  }

  static async getById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const employee = await EmployeeService.getEmployeeById(id);
      return sendSuccess(res, 200, 'Employee retrieved successfully', employee);
    } catch (error) {
      return next(error);
    }
  }

  static async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const validated = adminUpdateEmployeeSchema.parse(req.body);
      const updated = await EmployeeService.adminUpdateEmployee(id, validated);
      return sendSuccess(res, 200, 'Employee updated successfully', updated);
    } catch (error) {
      return next(error);
    }
  }

  static async getBankDetails(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const bank = await EmployeeService.getBankDetails(id, req.user!.userId, req.user!.role);
      return sendSuccess(res, 200, 'Bank details retrieved successfully', bank || {});
    } catch (error) {
      return next(error);
    }
  }

  static async updateBankDetails(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const validated = updateBankDetailsSchema.parse(req.body);
      const updated = await EmployeeService.updateBankDetails(id, validated, req.user!.userId, req.user!.role);
      return sendSuccess(res, 200, 'Bank details updated successfully', updated);
    } catch (error) {
      return next(error);
    }
  }
}
