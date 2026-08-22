import { prisma } from './prisma';
import { AttendanceStatus, LeaveStatus } from '@prisma/client';

export class ReportRepository {
  static async getAttendanceReport(startDate?: Date, endDate?: Date) {
    const where: any = {};
    if (startDate && endDate) {
      where.date = { gte: startDate, lte: endDate };
    }

    const [totalEmployees, records] = await Promise.all([
      prisma.employeeProfile.count(),
      prisma.attendance.findMany({ where }),
    ]);

    const present = records.filter((r) => r.status === AttendanceStatus.PRESENT).length;
    const absent = records.filter((r) => r.status === AttendanceStatus.ABSENT).length;
    const halfDay = records.filter((r) => r.status === AttendanceStatus.HALF_DAY).length;
    const leave = records.filter((r) => r.status === AttendanceStatus.LEAVE).length;

    return {
      totalEmployees,
      totalAttendanceRecords: records.length,
      present,
      absent,
      halfDay,
      leave,
    };
  }

  static async getLeaveReport() {
    const requests = await prisma.leaveRequest.findMany();

    const pending = requests.filter((r) => r.status === LeaveStatus.PENDING).length;
    const approved = requests.filter((r) => r.status === LeaveStatus.APPROVED).length;
    const rejected = requests.filter((r) => r.status === LeaveStatus.REJECTED).length;

    const byType = requests.reduce((acc: any, req) => {
      acc[req.leaveType] = (acc[req.leaveType] || 0) + 1;
      return acc;
    }, {});

    return {
      totalRequests: requests.length,
      pending,
      approved,
      rejected,
      leaveTypeDistribution: byType,
    };
  }

  static async getPayrollReport() {
    const salaries = await prisma.salary.findMany({
      distinct: ['employeeId'],
      orderBy: [{ employeeId: 'asc' }, { effectiveFrom: 'desc' }],
    });

    const totalGross = salaries.reduce((acc, curr) => acc + curr.grossSalary, 0);
    const totalNet = salaries.reduce((acc, curr) => acc + curr.netSalary, 0);
    const totalDeductions = salaries.reduce((acc, curr) => acc + curr.deductions, 0);

    return {
      employeeCount: salaries.length,
      totalGrossSalary: totalGross,
      totalNetSalary: totalNet,
      totalDeductions,
      averageNetSalary: salaries.length > 0 ? Math.round(totalNet / salaries.length) : 0,
    };
  }
}
