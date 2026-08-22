import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import { verifyToken } from '../utils/jwt';
import { sendError } from '../utils/response';
import { Role } from '@prisma/client';

export const requireAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 401, 'Authentication token missing or invalid');
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = verifyToken(token);
    req.user = payload;
    return next();
  } catch (error) {
    return sendError(res, 401, 'Invalid or expired authentication token');
  }
};

export const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return sendError(res, 401, 'Authentication required');
  }
  if (req.user.role !== Role.ADMIN) {
    return sendError(res, 403, 'Access denied. Administrator privileges required.');
  }
  return next();
};

export const requireHR = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return sendError(res, 401, 'Authentication required');
  }
  if (req.user.role !== Role.HR) {
    return sendError(res, 403, 'Access denied. HR privileges required.');
  }
  return next();
};

export const requireAdminOrHR = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return sendError(res, 401, 'Authentication required');
  }
  if (req.user.role !== Role.ADMIN && req.user.role !== Role.HR) {
    return sendError(res, 403, 'Access denied. Admin or HR privileges required.');
  }
  return next();
};
