import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { sendError } from '../utils/response';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Centralized Error Middleware caught:', err);

  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`);
    return sendError(res, 422, 'Validation failed', formattedErrors);
  }

  if (err.name === 'UnauthorizedError' || err.status === 401) {
    return sendError(res, 401, err.message || 'Unauthorized');
  }

  if (err.status === 403) {
    return sendError(res, 403, err.message || 'Forbidden');
  }

  if (err.status === 404) {
    return sendError(res, 404, err.message || 'Resource not found');
  }

  if (err.code === 'P2002') {
    const fields = (err.meta?.target as string[]) || [];
    return sendError(res, 409, `Duplicate entry for field(s): ${fields.join(', ')}`);
  }

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';
  return sendError(res, statusCode, message);
};
