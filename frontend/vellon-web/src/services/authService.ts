import api from './api';

export interface LoginResponse {
  token: string;
  fullName: string;
  isSuperAdmin: boolean;
  expiresAt: string;
}

export interface AdminMe {
  id: number;
  username: string;
  email: string;
  fullName: string;
  isActive: boolean;
  isSuperAdmin: boolean;
  createdAt: string;
}

export const authService = {
  login: (data: { username: string; password: string }) =>
    api.post<LoginResponse>('/auth/login', data).then((r) => r.data),

  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }).then((r) => r.data),

  resetPassword: (data: { token: string; newPassword: string; confirmPassword: string }) =>
    api.post('/auth/reset-password', data).then((r) => r.data),

  getMe: () => api.get<AdminMe>('/auth/me').then((r) => r.data),
};
