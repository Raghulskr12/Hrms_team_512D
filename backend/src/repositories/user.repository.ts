import { prisma } from './prisma';
import { Role, UserStatus } from '@prisma/client';

export class UserRepository {
  static async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });
  }

  static async findByEmployeeId(employeeId: string) {
    return prisma.user.findUnique({
      where: { employeeId },
      include: { profile: true },
    });
  }

  static async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: { profile: true },
    });
  }

  static async createUser(data: {
    employeeId: string;
    email: string;
    passwordHash: string;
    role?: Role;
    status?: UserStatus;
    emailVerified?: boolean;
    verificationToken?: string;
    firstName: string;
    lastName: string;
    designation?: string;
    department?: string;
  }) {
    const { firstName, lastName, designation, department, ...userData } = data;
    return prisma.user.create({
      data: {
        ...userData,
        profile: {
          create: {
            firstName,
            lastName,
            designation: designation || 'Employee',
            department: department || 'General',
            joiningDate: new Date(),
          },
        },
      },
      include: { profile: true },
    });
  }

  static async verifyEmail(token: string) {
    const user = await prisma.user.findFirst({
      where: { verificationToken: token },
    });
    if (!user) return null;

    return prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationToken: null,
      },
    });
  }
}
