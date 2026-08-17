import api from './api';

export interface CreateVolunteerInput {
  fullName: string;
  idNumber: string;
  birthDate: string;
  phone: string;
  email: string;
  address?: string;
  currentOccupation?: string;
  availableDays?: string;
  availableSchedule?: string;
  weeklyHours?: number;
  specialAvailability?: string;
  skills?: string;
  otherSkills?: string;
  previousVolunteerExperience?: string;
  educationLevel?: string;
  languages?: string;
  interestAreas?: string;
  otherInterestArea?: string;
  reference1Name?: string;
  reference1Relation?: string;
  reference1Phone?: string;
  reference1Email?: string;
  reference2Name?: string;
  reference2Relation?: string;
  reference2Phone?: string;
  reference2Email?: string;
  motivation?: string;
  expectedContribution?: string;
}

export interface Volunteer {
  id: number;
  fullName: string;
  idNumber: string;
  phone: string;
  email: string;
  availableSchedule?: string;
  status: string;
  createdAt: string;
}

export const volunteerService = {
  create: (data: CreateVolunteerInput) => api.post('/volunteers', data).then((r) => r.data),
  getAll: (status?: string) =>
    api.get<Volunteer[]>('/volunteers', { params: status ? { status } : {} }).then((r) => r.data),
  getById: (id: number) => api.get<Volunteer>(`/volunteers/${id}`).then((r) => r.data),
  updateStatus: (id: number, status: string) =>
    api.patch<Volunteer>(`/volunteers/${id}/status`, { status }).then((r) => r.data),
  delete: (id: number) => api.delete(`/volunteers/${id}`),
};
