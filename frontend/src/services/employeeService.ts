import { api } from '../lib/api';
import { EmployeeProfile, BankDetails } from '../types';

export const employeeService = {
  getAll: async (params?: { search?: string; department?: string; status?: string; page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.department) query.append('department', params.department);
    if (params?.status) query.append('status', params.status);
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());

    const res = await api.get<{ employees: EmployeeProfile[]; total: number }>(`/employees?${query.toString()}`);
    return res.data;
  },

  getById: async (id: string) => {
    const res = await api.get<EmployeeProfile>(`/employees/${id}`);
    return res.data;
  },

  adminUpdate: async (id: string, data: any) => {
    const res = await api.put<EmployeeProfile>(`/employees/${id}`, data);
    return res.data;
  },

  getBankDetails: async (employeeProfileId: string) => {
    const res = await api.get<BankDetails>(`/employees/${employeeProfileId}/bank-details`);
    return res.data;
  },

  updateBankDetails: async (employeeProfileId: string, data: any) => {
    const res = await api.put<BankDetails>(`/employees/${employeeProfileId}/bank-details`, data);
    return res.data;
  },
};
