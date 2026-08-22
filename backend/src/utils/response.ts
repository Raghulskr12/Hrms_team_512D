import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any[];
}

export const sendSuccess = <T>(res: Response, statusCode: number, message: string, data?: T) => {
  const payload: ApiResponse<T> = {
    success: true,
    message,
    ...(data !== undefined && { data }),
  };
  return res.status(statusCode).json(payload);
};

export const sendError = (res: Response, statusCode: number, message: string, errors: any[] = []) => {
  const payload: ApiResponse = {
    success: false,
    message,
    ...(errors.length > 0 && { errors }),
  };
  return res.status(statusCode).json(payload);
};
