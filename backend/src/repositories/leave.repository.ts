import { prisma } from './prisma';
import { LeaveType, LeaveStatus, AttendanceStatus } from '@prisma/client';

export class LeaveRepository {
  static async findBalances(employeeId: string) {
    return prisma.leaveBalance.findMany({
      where: { employeeId },
    });
  }

  static async findBalanceByType(employeeId: string, leaveType: LeaveType) {
    return prisma.leaveBalance.findUnique({
      where: {
        employeeId_leaveType: {
          employeeId,
          leaveType,
        },
      },
    });
  }

  static async findEmployeeRequests(employeeId: string) {
    return prisma.leaveRequest.findMany({
      where: { employeeId },
      include: {
        approvedBy: {
          select: {
            id: true,
            employeeId: true,
            profile: { select: { firstName: true, lastName: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async findAllRequests(params?: { status?: LeaveStatus; leaveType?: LeaveType }) {
    const where: any = {};
    if (params?.status) where.status = params.status;
    if (params?.leaveType) where.leaveType = params.leaveType;

    return prisma.leaveRequest.findMany({
      where,
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            department: true,
            designation: true,
            employmentType: true,
            user: { select: { id: true, employeeId: true } },
          },
        },
        approvedBy: {
          select: {
            id: true,
            profile: { select: { firstName: true, lastName: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async findById(id: string) {
    return prisma.leaveRequest.findUnique({
      where: { id },
      include: {
        employee: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  static async findOverlapping(employeeId: string, startDate: Date, endDate: Date) {
    return prisma.leaveRequest.findFirst({
      where: {
        employeeId,
        status: { in: [LeaveStatus.PENDING, LeaveStatus.APPROVED] },
        OR: [
          {
            startDate: { lte: endDate },
            endDate: { gte: startDate },
          },
        ],
      },
    });
  }

  static async createRequest(data: {
    employeeId: string;
    leaveType: LeaveType;
    startDate: Date;
    endDate: Date;
    numberOfDays: number;
    reason: string;
  }) {
    return prisma.leaveRequest.create({
      data: {
        employeeId: data.employeeId,
        leaveType: data.leaveType,
        startDate: data.startDate,
        endDate: data.endDate,
        numberOfDays: data.numberOfDays,
        reason: data.reason,
        status: LeaveStatus.PENDING,
      },
    });
  }

  static async approveTransaction(data: {
    requestId: string;
    approverUserId: string;
    comment?: string;
  }) {
    const request = await this.findById(data.requestId);
    if (!request) {
      throw { statusCode: 404, message: 'Leave request not found' };
    }
    if (request.status !== LeaveStatus.PENDING) {
      throw { statusCode: 400, message: `Leave request is already ${request.status.toLowerCase()}` };
    }

    const balance = await this.findBalanceByType(request.employeeId, request.leaveType);
    if (!balance || balance.remainingDays < request.numberOfDays) {
      throw { statusCode: 400, message: 'Insufficient leave balance to approve this request' };
    }

    return prisma.$transaction(async (tx) => {
      // 1. Update LeaveRequest
      const updatedRequest = await tx.leaveRequest.update({
        where: { id: data.requestId },
        data: {
          status: LeaveStatus.APPROVED,
          approvalComment: data.comment || 'Approved by HR/Admin',
          approvedById: data.approverUserId,
          approvedAt: new Date(),
        },
      });

      // 2. Update LeaveBalance
      await tx.leaveBalance.update({
        where: { id: balance.id },
        data: {
          usedDays: balance.usedDays + request.numberOfDays,
          remainingDays: balance.remainingDays - request.numberOfDays,
        },
      });

      // 3. Mark Attendance for working days in range
      const curr = new Date(request.startDate);
      const end = new Date(request.endDate);

      while (curr <= end) {
        const dayOfWeek = curr.getDay();
        // 0 = Sunday, 6 = Saturday (Filter working days Monday-Friday)
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          const dateOnly = new Date(curr);
          dateOnly.setHours(0, 0, 0, 0);

          await tx.attendance.upsert({
            where: {
              employeeId_date: {
                employeeId: request.employeeId,
                date: dateOnly,
              },
            },
            create: {
              employeeId: request.employeeId,
              date: dateOnly,
              status: AttendanceStatus.LEAVE,
              remarks: `Approved ${request.leaveType} leave`,
            },
            update: {
              status: AttendanceStatus.LEAVE,
              remarks: `Approved ${request.leaveType} leave`,
            },
          });
        }
        curr.setDate(curr.getDate() + 1);
      }

      // 4. Create Notification
      await tx.notification.create({
        data: {
          userId: request.employee.userId,
          title: 'Leave Request Approved',
          message: `Your ${request.leaveType} leave request for ${request.numberOfDays} day(s) (${request.startDate.toISOString().split('T')[0]} to ${request.endDate.toISOString().split('T')[0]}) has been approved.`,
          type: 'SUCCESS',
        },
      });

      return updatedRequest;
    });
  }

  static async rejectTransaction(data: {
    requestId: string;
    approverUserId: string;
    comment: string;
  }) {
    const request = await this.findById(data.requestId);
    if (!request) {
      throw { statusCode: 404, message: 'Leave request not found' };
    }
    if (request.status !== LeaveStatus.PENDING) {
      throw { statusCode: 400, message: `Leave request is already ${request.status.toLowerCase()}` };
    }

    return prisma.$transaction(async (tx) => {
      // 1. Update LeaveRequest
      const updatedRequest = await tx.leaveRequest.update({
        where: { id: data.requestId },
        data: {
          status: LeaveStatus.REJECTED,
          approvalComment: data.comment,
          approvedById: data.approverUserId,
          approvedAt: new Date(),
        },
      });

      // 2. Create Notification
      await tx.notification.create({
        data: {
          userId: request.employee.userId,
          title: 'Leave Request Rejected',
          message: `Your ${request.leaveType} leave request was rejected. Reason: ${data.comment}`,
          type: 'WARNING',
        },
      });

      return updatedRequest;
    });
  }
}
