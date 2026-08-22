import { prisma } from './prisma';

export class PayrollRepository {
  static async findSalaryByEmployeeId(employeeId: string) {
    return prisma.salary.findFirst({
      where: { employeeId },
      orderBy: { effectiveFrom: 'desc' },
    });
  }

  static async findSalaryHistory(employeeId: string) {
    return prisma.salary.findMany({
      where: { employeeId },
      orderBy: { effectiveFrom: 'desc' },
    });
  }

  static async findAllPayroll() {
    return prisma.salary.findMany({
      distinct: ['employeeId'],
      orderBy: [{ employeeId: 'asc' }, { effectiveFrom: 'desc' }],
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            department: true,
            designation: true,
            user: { select: { employeeId: true, email: true } },
          },
        },
      },
    });
  }

  static async upsertSalary(employeeId: string, data: {
    basicSalary: number;
    hra: number;
    allowances: number;
    deductions: number;
    effectiveFrom?: Date;
  }) {
    const grossSalary = data.basicSalary + data.hra + data.allowances;
    const netSalary = Math.max(0, grossSalary - data.deductions);
    const effectiveFrom = data.effectiveFrom || new Date();

    // Close previous active salary record if existing
    const previousSalary = await this.findSalaryByEmployeeId(employeeId);
    if (previousSalary && !previousSalary.effectiveTo) {
      await prisma.salary.update({
        where: { id: previousSalary.id },
        data: { effectiveTo: effectiveFrom },
      });
    }

    return prisma.salary.create({
      data: {
        employeeId,
        basicSalary: data.basicSalary,
        hra: data.hra,
        allowances: data.allowances,
        deductions: data.deductions,
        grossSalary,
        netSalary,
        effectiveFrom,
      },
    });
  }
}
