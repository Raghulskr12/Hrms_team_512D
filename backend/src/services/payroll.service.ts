import { PayrollRepository } from '../repositories/payroll.repository';
import { EmployeeRepository } from '../repositories/employee.repository';

export class PayrollService {
  static async getOwnSalary(userId: string) {
    const profile = await EmployeeRepository.findByUserId(userId);
    if (!profile) {
      throw { statusCode: 404, message: 'Employee profile not found' };
    }
    const salary = await PayrollRepository.findSalaryByEmployeeId(profile.id);
    if (!salary) {
      throw { statusCode: 404, message: 'Salary structure not defined for this employee' };
    }
    return salary;
  }

  static async getOwnSalaryHistory(userId: string) {
    const profile = await EmployeeRepository.findByUserId(userId);
    if (!profile) {
      throw { statusCode: 404, message: 'Employee profile not found' };
    }
    return PayrollRepository.findSalaryHistory(profile.id);
  }

  static async getAllPayroll() {
    return PayrollRepository.findAllPayroll();
  }

  static async getEmployeeSalary(employeeProfileId: string) {
    const profile = await EmployeeRepository.findById(employeeProfileId);
    if (!profile) {
      throw { statusCode: 404, message: 'Employee profile not found' };
    }
    return PayrollRepository.findSalaryByEmployeeId(profile.id);
  }

  static async updateEmployeeSalary(employeeProfileId: string, data: {
    basicSalary: number;
    hra: number;
    allowances: number;
    deductions: number;
    effectiveFrom?: string;
  }) {
    const profile = await EmployeeRepository.findById(employeeProfileId);
    if (!profile) {
      throw { statusCode: 404, message: 'Employee profile not found' };
    }

    const effectiveFromDate = data.effectiveFrom ? new Date(data.effectiveFrom) : new Date();

    return PayrollRepository.upsertSalary(profile.id, {
      ...data,
      effectiveFrom: effectiveFromDate,
    });
  }
}
