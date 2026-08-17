import api from './api';

export interface AdminRecord {
  id: number;
  username: string;
  email: string;
  fullName: string;
  isActive: boolean;
  isSuperAdmin: boolean;
  createdAt: string;
}

export interface CreateAdminInput {
  username: string;
  email: string;
  fullName: string;
  password: string;
}

export interface UpdateAdminInput {
  email: string;
  fullName: string;
  isActive: boolean;
}

export const adminService = {
  getAll: () => api.get<AdminRecord[]>('/admins').then((r) => r.data),
  getById: (id: number) => api.get<AdminRecord>(`/admins/${id}`).then((r) => r.data),
  create: (data: CreateAdminInput) => api.post<AdminRecord>('/admins', data).then((r) => r.data),
  update: (id: number, data: UpdateAdminInput) =>
    api.put<AdminRecord>(`/admins/${id}`, data).then((r) => r.data),
  toggleActive: (id: number) => api.patch(`/admins/${id}/toggle-active`).then((r) => r.data),
  delete: (id: number) => api.delete(`/admins/${id}`),
};
