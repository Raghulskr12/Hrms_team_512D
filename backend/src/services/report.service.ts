import { ReportRepository } from '../repositories/report.repository';

export class ReportService {
  static async getAttendanceReport(startDate?: string, endDate?: string) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return ReportRepository.getAttendanceReport(start, end);
  }

  static async getLeaveReport() {
    return ReportRepository.getLeaveReport();
  }

  static async getPayrollReport() {
    return ReportRepository.getPayrollReport();
  }
}
