import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import { ReportService } from '../services/report.service';
import { sendSuccess } from '../utils/response';

export class ReportController {
  static async getAttendanceReport(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const startDate = req.query.startDate as string;
      const endDate = req.query.endDate as string;
      const report = await ReportService.getAttendanceReport(startDate, endDate);
      return sendSuccess(res, 200, 'Attendance report generated', report);
    } catch (error) {
      return next(error);
    }
  }

  static async getLeaveReport(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const report = await ReportService.getLeaveReport();
      return sendSuccess(res, 200, 'Leave report generated', report);
    } catch (error) {
      return next(error);
    }
  }

  static async getPayrollReport(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const report = await ReportService.getPayrollReport();
      return sendSuccess(res, 200, 'Payroll report generated', report);
    } catch (error) {
      return next(error);
    }
  }
}
