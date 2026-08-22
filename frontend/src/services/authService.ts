import { api } from '../lib/api';
import { User } from '../types';

export const authService = {
  login: async (credentials: { email: string; password: string }) => {
    const res = await api.post<{ token: string; user: User }>('/auth/login', credentials);
    if (res.data?.token) {
      localStorage.setItem('dayflow_token', res.data.token);
      localStorage.setItem('dayflow_user', JSON.stringify(res.data.user));
    }
    return res.data;
  },

  register: async (payload: {
    employeeId: string;
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    const res = await api.post('/auth/register', payload);
    return res.data;
  },

  verifyEmail: async (token: string) => {
    const res = await api.post('/auth/verify-email', { token });
    return res;
  },

  getCurrentUser: async () => {
    const res = await api.get<User>('/auth/me');
    return res.data;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // ignore network logout errors
    } finally {
      localStorage.removeItem('dayflow_token');
      localStorage.removeItem('dayflow_user');
    }
  },
};
