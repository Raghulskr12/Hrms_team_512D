import { ApiResponse } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('dayflow_token');
};

export const apiFetch = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const token = getAuthToken();

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data: ApiResponse<T> = await response.json().catch(() => ({
    success: false,
    message: 'Server error or invalid JSON response',
  }));

  if (!response.ok || !data.success) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
};

export const api = {
  get: <T = any>(endpoint: string) => apiFetch<T>(endpoint, { method: 'GET' }),
  post: <T = any>(endpoint: string, body?: any) =>
    apiFetch<T>(endpoint, {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  put: <T = any>(endpoint: string, body?: any) =>
    apiFetch<T>(endpoint, {
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  patch: <T = any>(endpoint: string, body?: any) =>
    apiFetch<T>(endpoint, {
      method: 'PATCH',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  delete: <T = any>(endpoint: string) => apiFetch<T>(endpoint, { method: 'DELETE' }),
};
