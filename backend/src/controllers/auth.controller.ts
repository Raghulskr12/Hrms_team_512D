import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { registerSchema, loginSchema, verifyEmailSchema } from '../validators/auth.validator';
import { sendSuccess } from '../utils/response';
import { AuthenticatedRequest } from '../types';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = registerSchema.parse(req.body);
      const result = await AuthService.register(validated);
      return sendSuccess(res, 201, result.message, result.user);
    } catch (error) {
      return next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = loginSchema.parse(req.body);
      const result = await AuthService.login(validated);
      return sendSuccess(res, 200, 'Login successful', result);
    } catch (error) {
      return next(error);
    }
  }

  static async verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = verifyEmailSchema.parse(req.body);
      const result = await AuthService.verifyEmail(validated.token);
      return sendSuccess(res, 200, result.message);
    } catch (error) {
      return next(error);
    }
  }

  static async me(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const user = await AuthService.getCurrentUser(req.user!.userId);
      return sendSuccess(res, 200, 'Current authenticated user profile', user);
    } catch (error) {
      return next(error);
    }
  }

  static async logout(req: Request, res: Response) {
    return sendSuccess(res, 200, 'Logout successful. Clear client authorization header/token.');
  }
}
