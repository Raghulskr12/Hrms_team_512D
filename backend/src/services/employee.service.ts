import { EmployeeRepository } from '../repositories/employee.repository';
import { prisma } from '../repositories/prisma';

export class EmployeeService {
  static async getOwnProfile(userId: string) {
    const profile = await EmployeeRepository.findByUserId(userId);
    if (!profile) {
      throw { statusCode: 404, message: 'Employee profile not found' };
    }
    return profile;
  }

  static async updateOwnProfile(userId: string, data: {
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    profilePicture?: string;
  }) {
    const profile = await EmployeeRepository.findByUserId(userId);
    if (!profile) {
      throw { statusCode: 404, message: 'Employee profile not found' };
    }

    return EmployeeRepository.updateProfile(profile.id, data);
  }

  static async getAllEmployees(params: {
    search?: string;
    department?: string;
    status?: string;
    skip?: number;
    take?: number;
  }) {
    return EmployeeRepository.findAll(params);
  }

  static async getEmployeeById(id: string) {
    const profile = await EmployeeRepository.findById(id);
    if (!profile) {
      throw { statusCode: 404, message: 'Employee profile not found' };
    }
    return profile;
  }

  static async adminUpdateEmployee(id: string, data: any) {
    const profile = await EmployeeRepository.findById(id);
    if (!profile) {
      throw { statusCode: 404, message: 'Employee profile not found' };
    }

    const { role, status, firstName, lastName, ...profileData } = data;

    if (role || status) {
      await prisma.user.update({
        where: { id: profile.userId },
        data: {
          ...(role && { role }),
          ...(status && { status }),
        },
      });
    }

    return EmployeeRepository.updateProfile(id, {
      ...profileData,
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
    });
  }

  static async getBankDetails(employeeProfileId: string, requestingUserId: string, requestingUserRole: string) {
    const targetProfile = await EmployeeRepository.findById(employeeProfileId);
    if (!targetProfile) {
      throw { statusCode: 404, message: 'Employee profile not found' };
    }

    // Security check: Only the employee themselves OR Admin/HR can view bank details
    if (targetProfile.userId !== requestingUserId && requestingUserRole !== 'ADMIN' && requestingUserRole !== 'HR') {
      throw { statusCode: 403, message: 'Unauthorized to view these bank details' };
    }

    return EmployeeRepository.findBankDetails(targetProfile.id);
  }

  static async updateBankDetails(employeeProfileId: string, data: any, requestingUserId: string, requestingUserRole: string) {
    const targetProfile = await EmployeeRepository.findById(employeeProfileId);
    if (!targetProfile) {
      throw { statusCode: 404, message: 'Employee profile not found' };
    }

    // Security check: Only the employee themselves OR Admin/HR can update bank details
    if (targetProfile.userId !== requestingUserId && requestingUserRole !== 'ADMIN' && requestingUserRole !== 'HR') {
      throw { statusCode: 403, message: 'Unauthorized to modify these bank details' };
    }

    return EmployeeRepository.upsertBankDetails(targetProfile.id, data);
  }
}
