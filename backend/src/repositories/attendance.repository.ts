import { prisma } from './prisma';
import { AttendanceStatus } from '@prisma/client';

export class AttendanceRepository {
  static async findByEmployeeAndDate(employeeId: string, date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    return prisma.attendance.findFirst({
      where: {
        employeeId,
        date: startOfDay,
      },
    });
  }

  static async checkIn(employeeId: string, remarks?: string) {
    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    const existing = await this.findByEmployeeAndDate(employeeId, today);
    if (existing) {
      if (existing.checkIn) {
        throw { statusCode: 400, message: 'You have already checked in for today.' };
      }
      return prisma.attendance.update({
        where: { id: existing.id },
        data: {
          checkIn: now,
          status: AttendanceStatus.PRESENT,
          remarks: remarks || existing.remarks,
        },
      });
    }

    return prisma.attendance.create({
      data: {
        employeeId,
        date: today,
        checkIn: now,
        status: AttendanceStatus.PRESENT,
        remarks,
      },
    });
  }

  static async checkOut(employeeId: string, remarks?: string) {
    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    const existing = await this.findByEmployeeAndDate(employeeId, today);
    if (!existing || !existing.checkIn) {
      throw { statusCode: 400, message: 'You must check in before checking out.' };
    }
    if (existing.checkOut) {
      throw { statusCode: 400, message: 'You have already checked out for today.' };
    }

    const checkInTime = new Date(existing.checkIn).getTime();
    const checkOutTime = now.getTime();
    const workedHours = parseFloat(((checkOutTime - checkInTime) / (1000 * 60 * 60)).toFixed(2));

    const status = workedHours < 4 ? AttendanceStatus.HALF_DAY : AttendanceStatus.PRESENT;

    return prisma.attendance.update({
      where: { id: existing.id },
      data: {
        checkOut: now,
        workedHours,
        status,
        remarks: remarks || existing.remarks,
      },
    });
  }

  static async findEmployeeAttendance(employeeId: string, startDate?: Date, endDate?: Date) {
    const where: any = { employeeId };
    if (startDate && endDate) {
      where.date = {
        gte: startDate,
        lte: endDate,
      };
    }

    return prisma.attendance.findMany({
      where,
      orderBy: { date: 'desc' },
    });
  }

  static async findAllAttendance(params: {
    employeeId?: string;
    department?: string;
    status?: AttendanceStatus;
    startDate?: Date;
    endDate?: Date;
  }) {
    const { employeeId, department, status, startDate, endDate } = params;

    const where: any = {};
    if (employeeId) where.employeeId = employeeId;
    if (status) where.status = status;
    if (startDate && endDate) {
      where.date = { gte: startDate, lte: endDate };
    }
    if (department && department !== 'ALL') {
      where.employee = { department };
    }

    return prisma.attendance.findMany({
      where,
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            department: true,
            designation: true,
            user: { select: { employeeId: true } },
          },
        },
      },
      orderBy: { date: 'desc' },
    });
  }

  static async adminUpdate(id: string, data: {
    checkIn?: Date;
    checkOut?: Date;
    status: AttendanceStatus;
    remarks?: string;
  }) {
    let workedHours = 0;
    if (data.checkIn && data.checkOut) {
      const diff = new Date(data.checkOut).getTime() - new Date(data.checkIn).getTime();
      workedHours = parseFloat(Math.max(0, diff / (1000 * 60 * 60)).toFixed(2));
    }

    return prisma.attendance.update({
      where: { id },
      data: {
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        workedHours,
        status: data.status,
        remarks: data.remarks,
      },
    });
  }
}
