import api from './api';

export interface ActivityPublic {
  id: number;
  title: string;
  description: string;
  activityDate: string;
  imageUrl?: string;
}

export interface ActivityAdmin {
  id: number;
  title: string;
  description: string;
  activityDate: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreateActivityInput {
  title: string;
  description: string;
  activityDate: string;
  imageUrl?: string;
  isActive: boolean;
}

export const activityService = {
  getPublic: () => api.get<ActivityPublic[]>('/activities/public').then((r) => r.data),
  getAll: () => api.get<ActivityAdmin[]>('/activities').then((r) => r.data),
  getById: (id: number) => api.get<ActivityAdmin>(`/activities/${id}`).then((r) => r.data),
  create: (data: CreateActivityInput) => api.post<ActivityAdmin>('/activities', data).then((r) => r.data),
  update: (id: number, data: CreateActivityInput) =>
    api.put<ActivityAdmin>(`/activities/${id}`, data).then((r) => r.data),
  toggle: (id: number) => api.patch<ActivityAdmin>(`/activities/${id}/toggle`).then((r) => r.data),
  delete: (id: number) => api.delete(`/activities/${id}`),
};
