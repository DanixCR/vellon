import api from './api';

export interface FamilyMember {
  id: number;
  name: string;
  age: number;
  occupation?: string;
  employmentType?: string;
  monthlyIncome?: number;
  workplace?: string;
  phone?: string;
}

export interface FamilyMemberInput {
  name: string;
  age: number;
  occupation?: string;
  employmentType?: string;
  monthlyIncome?: number;
  workplace?: string;
  phone?: string;
}

export interface HouseholdItem {
  id: number;
  itemName: string;
  quantity: number;
  condition?: string;
  acquisitionType?: string;
  hasPendingPayments: boolean;
}

export interface HouseholdItemInput {
  itemName: string;
  quantity: number;
  condition?: string;
  acquisitionType?: string;
  hasPendingPayments: boolean;
}

export interface SocioeconomicSummary {
  id: number;
  createdAt: string;
  familyMemberCount: number;
  totalIncome: number;
  totalExpenses: number;
}

export interface SocioeconomicDetail {
  id: number;
  createdAt: string;
  alimonyAmount?: number;
  alimonyDetails?: string;
  isAlimonyVoluntary: boolean;
  imasSubsidy?: number;
  imasSubsidyProgram?: string;
  otherInstitutionAid?: number;
  otherInstitutionAidDetails?: string;
  otherIncome?: number;
  otherIncomeDetails?: string;
  foodExpense?: number;
  educationExpense?: number;
  servicesExpense?: number;
  medicineExpense?: number;
  rentExpense?: number;
  cableExpense?: number;
  debtExpense?: number;
  otherExpenses?: number;
  otherExpensesDetails?: string;
  hasCreditCard: boolean;
  creditCardBank?: string;
  creditCardDebt?: number;
  hasSavings: boolean;
  savingsBank?: string;
  savingsAmount?: number;
  housingType: string;
  housingOwnerName?: string;
  housingOwnerIdNumber?: string;
  rentIsUpToDate?: boolean;
  housingDebtStatus?: string;
  familyMembers: FamilyMember[];
  householdItems: HouseholdItem[];
}

export interface CreateSocioeconomicInput {
  alimonyAmount?: number;
  alimonyDetails?: string;
  isAlimonyVoluntary: boolean;
  imasSubsidy?: number;
  imasSubsidyProgram?: string;
  otherInstitutionAid?: number;
  otherInstitutionAidDetails?: string;
  otherIncome?: number;
  otherIncomeDetails?: string;
  foodExpense?: number;
  educationExpense?: number;
  servicesExpense?: number;
  medicineExpense?: number;
  rentExpense?: number;
  cableExpense?: number;
  debtExpense?: number;
  otherExpenses?: number;
  otherExpensesDetails?: string;
  hasCreditCard: boolean;
  creditCardBank?: string;
  creditCardDebt?: number;
  hasSavings: boolean;
  savingsBank?: string;
  savingsAmount?: number;
  housingType: string;
  housingOwnerName?: string;
  housingOwnerIdNumber?: string;
  rentIsUpToDate?: boolean;
  housingDebtStatus?: string;
  familyMembers: FamilyMemberInput[];
  householdItems: HouseholdItemInput[];
}

export const socioeconomicService = {
  getAll: () => api.get<SocioeconomicSummary[]>('/socioeconomic-studies').then((r) => r.data),
  getById: (id: number) => api.get<SocioeconomicDetail>(`/socioeconomic-studies/${id}`).then((r) => r.data),
  create: (data: CreateSocioeconomicInput) =>
    api.post<SocioeconomicDetail>('/socioeconomic-studies', data).then((r) => r.data),
  update: (id: number, data: CreateSocioeconomicInput) =>
    api.put<SocioeconomicDetail>(`/socioeconomic-studies/${id}`, data).then((r) => r.data),
  delete: (id: number) => api.delete(`/socioeconomic-studies/${id}`),
};
