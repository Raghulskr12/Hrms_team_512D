import { api } from '../lib/api';

export const reportService = {
  getAttendanceReport: async (startDate?: string, endDate?: string) => {
    const query = new URLSearchParams();
    if (startDate) query.append('startDate', startDate);
    if (endDate) query.append('endDate', endDate);
    const res = await api.get(`/reports/attendance?${query.toString()}`);
    return res.data;
  },

  getLeaveReport: async () => {
    const res = await api.get('/reports/leaves');
    return res.data;
  },

  getPayrollReport: async () => {
    const res = await api.get('/reports/payroll');
    return res.data;
  },
};
