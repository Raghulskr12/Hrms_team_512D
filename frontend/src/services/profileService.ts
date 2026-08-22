import { api } from '../lib/api';
import { EmployeeProfile } from '../types';

export const profileService = {
  getProfile: async () => {
    const res = await api.get<EmployeeProfile>('/profile');
    return res.data;
  },

  updateProfile: async (data: {
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    profilePicture?: string;
  }) => {
    const res = await api.put<EmployeeProfile>('/profile', data);
    return res.data;
  },
};
