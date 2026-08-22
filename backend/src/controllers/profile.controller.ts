import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import { EmployeeService } from '../services/employee.service';
import { updateProfileSchema } from '../validators/employee.validator';
import { sendSuccess } from '../utils/response';

export class ProfileController {
  static async getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const profile = await EmployeeService.getOwnProfile(req.user!.userId);
      return sendSuccess(res, 200, 'Profile retrieved successfully', profile);
    } catch (error) {
      return next(error);
    }
  }

  static async updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const validated = updateProfileSchema.parse(req.body);
      const updated = await EmployeeService.updateOwnProfile(req.user!.userId, validated);
      return sendSuccess(res, 200, 'Profile updated successfully', updated);
    } catch (error) {
      return next(error);
    }
  }
}
