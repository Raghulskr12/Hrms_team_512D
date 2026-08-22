import { prisma } from './prisma';
import { Prisma } from '@prisma/client';

export class EmployeeRepository {
  static async findAll(params: {
    search?: string;
    department?: string;
    status?: string;
    skip?: number;
    take?: number;
  }) {
    const { search, department, status, skip = 0, take = 50 } = params;

    const where: Prisma.EmployeeProfileWhereInput = {};

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { user: { employeeId: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        { designation: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (department && department !== 'ALL') {
      where.department = { equals: department, mode: 'insensitive' };
    }

    if (status && status !== 'ALL') {
      where.user = {
        ...where.user,
        status: status as any,
      };
    }

    const [employees, total] = await Promise.all([
      prisma.employeeProfile.findMany({
        where,
        skip,
        take,
        include: {
          user: {
            select: {
              id: true,
              employeeId: true,
              email: true,
              role: true,
              status: true,
              emailVerified: true,
              createdAt: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.employeeProfile.count({ where }),
    ]);

    return { employees, total, skip, take };
  }

  static async findById(id: string) {
    return prisma.employeeProfile.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            employeeId: true,
            email: true,
            role: true,
            status: true,
            emailVerified: true,
            createdAt: true,
          },
        },
        leaveBalances: true,
      },
    });
  }

  static async findByUserId(userId: string) {
    return prisma.employeeProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            employeeId: true,
            email: true,
            role: true,
            status: true,
            emailVerified: true,
            createdAt: true,
          },
        },
        leaveBalances: true,
      },
    });
  }

  static async updateProfile(id: string, data: Prisma.EmployeeProfileUpdateInput) {
    return prisma.employeeProfile.update({
      where: { id },
      data,
      include: {
        user: {
          select: {
            id: true,
            employeeId: true,
            email: true,
            role: true,
            status: true,
          },
        },
      },
    });
  }

  static async findBankDetails(employeeId: string) {
    return prisma.bankDetails.findUnique({
      where: { employeeId },
    });
  }

  static async upsertBankDetails(employeeId: string, data: {
    accountHolderName: string;
    accountNumber: string;
    ifscCode: string;
    bankName: string;
    branchName: string;
  }) {
    return prisma.bankDetails.upsert({
      where: { employeeId },
      create: {
        employeeId,
        ...data,
      },
      update: data,
    });
  }
}
