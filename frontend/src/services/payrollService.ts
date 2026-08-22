import { api } from '../lib/api';
import { Salary } from '../types';

export const payrollService = {
  getMySalary: async () => {
    const res = await api.get<Salary>('/payroll/my-salary');
    return res.data;
  },

  getMySalaryHistory: async () => {
    const res = await api.get<Salary[]>('/payroll/my-history');
    return res.data;
  },

  getAllPayroll: async () => {
    const res = await api.get<Salary[]>('/payroll');
    return res.data;
  },

  getEmployeeSalary: async (employeeProfileId: string) => {
    const res = await api.get<Salary>(`/payroll/${employeeProfileId}`);
    return res.data;
  },

  updateSalary: async (employeeProfileId: string, data: {
    basicSalary: number;
    hra: number;
    allowances: number;
    deductions: number;
    effectiveFrom?: string;
  }) => {
    const res = await api.put<Salary>(`/payroll/${employeeProfileId}`, data);
    return res.data;
  },
};
