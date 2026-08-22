import { api } from '../lib/api';
import { Attendance } from '../types';

export const attendanceService = {
  checkIn: async (remarks?: string) => {
    const res = await api.post<Attendance>('/attendance/check-in', { remarks });
    return res.data;
  },

  checkOut: async (remarks?: string) => {
    const res = await api.post<Attendance>('/attendance/check-out', { remarks });
    return res.data;
  },

  getToday: async () => {
    const res = await api.get<Attendance | null>('/attendance/today');
    return res.data;
  },

  getMyHistory: async (startDate?: string, endDate?: string) => {
    const query = new URLSearchParams();
    if (startDate) query.append('startDate', startDate);
    if (endDate) query.append('endDate', endDate);
    const res = await api.get<Attendance[]>(`/attendance/my-history?${query.toString()}`);
    return res.data;
  },

  getAll: async (params?: { employeeId?: string; department?: string; status?: string; startDate?: string; endDate?: string }) => {
    const query = new URLSearchParams();
    if (params?.employeeId) query.append('employeeId', params.employeeId);
    if (params?.department) query.append('department', params.department);
    if (params?.status) query.append('status', params.status);
    if (params?.startDate) query.append('startDate', params.startDate);
    if (params?.endDate) query.append('endDate', params.endDate);
    const res = await api.get<Attendance[]>(`/attendance?${query.toString()}`);
    return res.data;
  },

  adminUpdate: async (id: string, data: any) => {
    const res = await api.put<Attendance>(`/attendance/${id}`, data);
    return res.data;
  },
};
