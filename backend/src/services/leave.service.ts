import { LeaveRepository } from '../repositories/leave.repository';
import { EmployeeRepository } from '../repositories/employee.repository';
import { LeaveType, LeaveStatus, EmploymentType } from '@prisma/client';
import { ApplyLeaveInput } from '../validators/leave.validator';

export class LeaveService {
  static async getBalances(userId: string) {
    const profile = await EmployeeRepository.findByUserId(userId);
    if (!profile) {
      throw { statusCode: 404, message: 'Employee profile not found' };
    }
    return LeaveRepository.findBalances(profile.id);
  }

  static async applyLeave(userId: string, data: ApplyLeaveInput) {
    const profile = await EmployeeRepository.findByUserId(userId);
    if (!profile) {
      throw { statusCode: 404, message: 'Employee profile not found' };
    }

    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    if (start > end) {
      throw { statusCode: 400, message: 'Start date cannot be after end date' };
    }

    // Check Exam leave eligibility (only INTERN employmentType)
    if (data.leaveType === LeaveType.EXAM && profile.employmentType !== EmploymentType.INTERN) {
      throw { statusCode: 400, message: 'Exam leave is eligible for Interns only' };
    }

    // Calculate number of working days
    let numberOfDays = 0;
    const curr = new Date(start);
    while (curr <= end) {
      const day = curr.getDay();
      if (day !== 0 && day !== 6) { // Exclude weekends
        numberOfDays++;
      }
      curr.setDate(curr.getDate() + 1);
    }

    if (numberOfDays <= 0) {
      throw { statusCode: 400, message: 'Selected date range contains no working days' };
    }

    // Check balance
    const balance = await LeaveRepository.findBalanceByType(profile.id, data.leaveType);
    if (!balance || balance.remainingDays < numberOfDays) {
      throw {
        statusCode: 400,
        message: `Insufficient ${data.leaveType} leave balance. Available: ${balance?.remainingDays || 0} day(s), Requested: ${numberOfDays} day(s)`,
      };
    }

    // Check overlapping requests
    const overlapping = await LeaveRepository.findOverlapping(profile.id, start, end);
    if (overlapping) {
      throw { statusCode: 400, message: 'You already have an active or pending leave request for the selected dates' };
    }

    return LeaveRepository.createRequest({
      employeeId: profile.id,
      leaveType: data.leaveType,
      startDate: start,
      endDate: end,
      numberOfDays,
      reason: data.reason,
    });
  }

  static async getOwnLeaveRequests(userId: string) {
    const profile = await EmployeeRepository.findByUserId(userId);
    if (!profile) {
      throw { statusCode: 404, message: 'Employee profile not found' };
    }
    return LeaveRepository.findEmployeeRequests(profile.id);
  }

  static async getAllLeaveRequests(params?: { status?: LeaveStatus; leaveType?: LeaveType }) {
    return LeaveRepository.findAllRequests(params);
  }

  static async approveLeave(requestId: string, approverUserId: string, comment?: string) {
    return LeaveRepository.approveTransaction({
      requestId,
      approverUserId,
      comment,
    });
  }

  static async rejectLeave(requestId: string, approverUserId: string, comment: string) {
    return LeaveRepository.rejectTransaction({
      requestId,
      approverUserId,
      comment,
    });
  }
}
