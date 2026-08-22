'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (payload: { employeeId: string; fullName: string; email: string; password: string; confirmPassword: string }) => Promise<any>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const loadUser = async () => {
    try {
      const storedToken = localStorage.getItem('dayflow_token');
      if (storedToken) {
        setToken(storedToken);
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      }
    } catch (error) {
      console.error('Failed to load authenticated user:', error);
      localStorage.removeItem('dayflow_token');
      localStorage.removeItem('dayflow_user');
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    const data = await authService.login(credentials);
    if (data?.token && data?.user) {
      setToken(data.token);
      setUser(data.user);
      if (data.user.role === 'ADMIN' || data.user.role === 'HR') {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard');
      }
    }
  };

  const register = async (payload: { employeeId: string; fullName: string; email: string; password: string; confirmPassword: string }) => {
    return authService.register(payload);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setToken(null);
    router.push('/login');
  };

  const refreshUser = async () => {
    await loadUser();
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
