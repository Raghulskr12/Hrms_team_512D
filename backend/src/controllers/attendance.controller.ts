import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import { AttendanceService } from '../services/attendance.service';
import { checkInSchema, checkOutSchema, adminUpdateAttendanceSchema } from '../validators/attendance.validator';
import { sendSuccess } from '../utils/response';

export class AttendanceController {
  static async checkIn(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const validated = checkInSchema.parse(req.body);
      const record = await AttendanceService.checkIn(req.user!.userId, validated.remarks);
      return sendSuccess(res, 200, 'Checked in successfully', record);
    } catch (error) {
      return next(error);
    }
  }

  static async checkOut(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const validated = checkOutSchema.parse(req.body);
      const record = await AttendanceService.checkOut(req.user!.userId, validated.remarks);
      return sendSuccess(res, 200, 'Checked out successfully', record);
    } catch (error) {
      return next(error);
    }
  }

  static async getToday(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const record = await AttendanceService.getTodayAttendance(req.user!.userId);
      return sendSuccess(res, 200, "Today's attendance status", record);
    } catch (error) {
      return next(error);
    }
  }

  static async getOwnHistory(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const startDate = req.query.startDate as string;
      const endDate = req.query.endDate as string;
      const records = await AttendanceService.getOwnAttendanceHistory(req.user!.userId, startDate, endDate);
      return sendSuccess(res, 200, 'Attendance history retrieved', records);
    } catch (error) {
      return next(error);
    }
  }

  static async getAll(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const employeeId = req.query.employeeId as string;
      const department = req.query.department as string;
      const status = req.query.status as any;
      const startDate = req.query.startDate as string;
      const endDate = req.query.endDate as string;

      const records = await AttendanceService.getAllAttendance({
        employeeId,
        department,
        status,
        startDate,
        endDate,
      });
      return sendSuccess(res, 200, 'All attendance records retrieved', records);
    } catch (error) {
      return next(error);
    }
  }

  static async adminUpdate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const validated = adminUpdateAttendanceSchema.parse(req.body);
      const updated = await AttendanceService.adminUpdateAttendance(id, validated);
      return sendSuccess(res, 200, 'Attendance record updated', updated);
    } catch (error) {
      return next(error);
    }
  }
}
