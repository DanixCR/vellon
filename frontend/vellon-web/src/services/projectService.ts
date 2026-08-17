import api from './api';

export interface ProjectActivity {
  id: number;
  activityName: string;
  estimatedDate?: string;
  responsible?: string;
  isCompleted: boolean;
}

export interface ProjectBudgetItem {
  id: number;
  concept: string;
  estimatedAmount: number;
  fundingSource?: string;
}

export interface ProjectList {
  id: number;
  name: string;
  projectType: string;
  status: string;
  startDate: string;
  estimatedEndDate?: string;
  responsibleName: string;
  estimatedBeneficiaries?: number;
  createdAt: string;
}

export interface ProjectDetail {
  id: number;
  name: string;
  description: string;
  projectType: string;
  status: string;
  startDate: string;
  estimatedEndDate?: string;
  duration?: string;
  mainObjective: string;
  specificObjectives?: string;
  targetPopulation?: string;
  estimatedBeneficiaries?: number;
  geographicLocation?: string;
  totalBudget?: number;
  hasFunding: boolean;
  fundingSource?: string;
  responsibleName: string;
  responsibleRole?: string;
  responsiblePhone?: string;
  responsibleEmail?: string;
  teamMembers?: string;
  adminNotes?: string;
  activities: ProjectActivity[];
  budgetItems: ProjectBudgetItem[];
  createdAt: string;
}

export interface ProjectActivityInput {
  activityName: string;
  estimatedDate?: string;
  responsible?: string;
}

export interface ProjectBudgetItemInput {
  concept: string;
  estimatedAmount: number;
  fundingSource?: string;
}

export interface CreateProjectInput {
  name: string;
  description: string;
  projectType: string;
  startDate: string;
  estimatedEndDate?: string;
  duration?: string;
  activityFrequency?: string;
  mainObjective: string;
  specificObjectives?: string;
  targetPopulation?: string;
  estimatedBeneficiaries?: number;
  geographicLocation?: string;
  selectionCriteria?: string;
  priorityPopulation?: string;
  totalBudget?: number;
  hasFunding: boolean;
  fundingSource?: string;
  additionalResources?: string;
  responsibleName: string;
  responsibleRole?: string;
  responsiblePhone?: string;
  responsibleEmail?: string;
  teamMembers?: string;
  adminNotes?: string;
  activities: ProjectActivityInput[];
  budgetItems: ProjectBudgetItemInput[];
}

export const projectService = {
  getAll: (status?: string) =>
    api.get<ProjectList[]>('/projects', { params: status ? { status } : {} }).then((r) => r.data),
  getById: (id: number) => api.get<ProjectDetail>(`/projects/${id}`).then((r) => r.data),
  create: (data: CreateProjectInput) => api.post<ProjectDetail>('/projects', data).then((r) => r.data),
  update: (id: number, data: CreateProjectInput) =>
    api.put<ProjectDetail>(`/projects/${id}`, data).then((r) => r.data),
  updateStatus: (id: number, status: string, adminNotes?: string) =>
    api.patch<ProjectDetail>(`/projects/${id}/status`, { status, adminNotes }).then((r) => r.data),
  completeActivity: (projectId: number, actId: number) =>
    api.patch<ProjectDetail>(`/projects/${projectId}/activities/${actId}/complete`).then((r) => r.data),
  delete: (id: number) => api.delete(`/projects/${id}`),
};
