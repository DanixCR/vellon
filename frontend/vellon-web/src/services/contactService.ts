import api from './api';

export interface CreateContactInput {
  fullName: string;
  email: string;
  phone?: string;
  message?: string;
  type: number;
}

export interface ContactRecord {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  message?: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export const contactService = {
  create: (data: CreateContactInput) => api.post('/contact-records', data).then((r) => r.data),
  getAll: () => api.get<ContactRecord[]>('/contact-records').then((r) => r.data),
  getById: (id: number) => api.get<ContactRecord>(`/contact-records/${id}`).then((r) => r.data),
  markAsRead: (id: number) => api.patch(`/contact-records/${id}/read`).then((r) => r.data),
  delete: (id: number) => api.delete(`/contact-records/${id}`),
};
