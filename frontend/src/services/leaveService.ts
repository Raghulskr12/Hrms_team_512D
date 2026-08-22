import { api } from '../lib/api';
import { LeaveBalance, LeaveRequest, LeaveType } from '../types';

export const leaveService = {
  getBalances: async () => {
    const res = await api.get<LeaveBalance[]>('/leaves/balances');
    return res.data;
  },

  applyLeave: async (data: { leaveType: LeaveType; startDate: string; endDate: string; reason: string }) => {
    const res = await api.post<LeaveRequest>('/leaves/apply', data);
    return res.data;
  },

  getMyRequests: async () => {
    const res = await api.get<LeaveRequest[]>('/leaves/my-requests');
    return res.data;
  },

  getAllRequests: async (status?: string, leaveType?: string) => {
    const query = new URLSearchParams();
    if (status) query.append('status', status);
    if (leaveType) query.append('leaveType', leaveType);
    const res = await api.get<LeaveRequest[]>(`/leaves?${query.toString()}`);
    return res.data;
  },

  approve: async (id: string, comment?: string) => {
    const res = await api.patch<LeaveRequest>(`/leaves/${id}/approve`, { comment });
    return res.data;
  },

  reject: async (id: string, comment: string) => {
    const res = await api.patch<LeaveRequest>(`/leaves/${id}/reject`, { comment });
    return res.data;
  },
};
