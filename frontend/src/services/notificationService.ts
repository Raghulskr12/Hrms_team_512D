import { api } from '../lib/api';
import { Notification } from '../types';

export const notificationService = {
  getAll: async (): Promise<Notification[]> => {
    const res = await api.get<Notification[]>('/notifications');
    return res.data || [];
  },

  markRead: async (id: string) => {
    const res = await api.patch(`/notifications/${id}/read`);
    return res;
  },

  markAllRead: async () => {
    const res = await api.patch('/notifications/read-all');
    return res;
  },
};
