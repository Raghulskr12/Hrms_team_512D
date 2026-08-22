import { AttendanceRepository } from '../repositories/attendance.repository';
import { EmployeeRepository } from '../repositories/employee.repository';

export class AttendanceService {
  static async checkIn(userId: string, remarks?: string) {
    const profile = await EmployeeRepository.findByUserId(userId);
    if (!profile) {
      throw { statusCode: 404, message: 'Employee profile not found' };
    }
    return AttendanceRepository.checkIn(profile.id, remarks);
  }

  static async checkOut(userId: string, remarks?: string) {
    const profile = await EmployeeRepository.findByUserId(userId);
    if (!profile) {
      throw { statusCode: 404, message: 'Employee profile not found' };
    }
    return AttendanceRepository.checkOut(profile.id, remarks);
  }

  static async getTodayAttendance(userId: string) {
    const profile = await EmployeeRepository.findByUserId(userId);
    if (!profile) {
      throw { statusCode: 404, message: 'Employee profile not found' };
    }
    const today = new Date();
    return AttendanceRepository.findByEmployeeAndDate(profile.id, today);
  }

  static async getOwnAttendanceHistory(userId: string, startDate?: string, endDate?: string) {
    const profile = await EmployeeRepository.findByUserId(userId);
    if (!profile) {
      throw { statusCode: 404, message: 'Employee profile not found' };
    }

    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;

    return AttendanceRepository.findEmployeeAttendance(profile.id, start, end);
  }

  static async getAllAttendance(params: {
    employeeId?: string;
    department?: string;
    status?: any;
    startDate?: string;
    endDate?: string;
  }) {
    const start = params.startDate ? new Date(params.startDate) : undefined;
    const end = params.endDate ? new Date(params.endDate) : undefined;

    return AttendanceRepository.findAllAttendance({
      ...params,
      startDate: start,
      endDate: end,
    });
  }

  static async adminUpdateAttendance(attendanceId: string, data: any) {
    return AttendanceRepository.adminUpdate(attendanceId, {
      checkIn: data.checkIn ? new Date(data.checkIn) : undefined,
      checkOut: data.checkOut ? new Date(data.checkOut) : undefined,
      status: data.status,
      remarks: data.remarks,
    });
  }
}
