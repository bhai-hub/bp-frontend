export type RoleType = 'SUPER_ADMIN' | 'HR_MANAGER' | 'EMPLOYEE';

export type OnboardingStatus =
  | 'INVITED'
  | 'ACCOUNT_CREATED'
  | 'PROFILE_PENDING'
  | 'IKIGAI_PENDING'
  | 'COMPLETED'
  | 'SUSPENDED';

export type IkigaiDimension = 'LOVE' | 'GOOD_AT' | 'WORLD_NEEDS' | 'PAID_FOR';

export type IkigaiQuestionType = 'TEXT' | 'LONG_TEXT' | 'SINGLE_SELECT' | 'MULTI_SELECT';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: RoleType;
  organizationId: string | null;
  organization?: OrganizationSummary | null;
  employee?: EmployeeSummary | null;
}

export interface OrganizationSummary {
  id: string;
  name: string;
  slug: string;
  currency: string;
  legalName?: string;
  status?: string;
  countryCode?: string;
  countryName?: string;
}

export interface EmployeeSummary {
  id: string;
  employeeCode: string;
  department: string;
  designation: string;
  onboardingStatus?: OnboardingStatus;
  onboardingCompletedAt?: string;
  wallet?: EmployeeWallet;
}

export interface EmployeeWallet {
  id: string;
  spendableBalance: number;
  loyaltyBalance: number;
  lifetimeBalance: number;
}

export interface Country {
  id: string;
  code: string;
  name: string;
  isActive: boolean;
}

export interface JurisdictionPolicy {
  id: string;
  countryCode: string;
  policyVersion: number;
  isActive: boolean;
  status: string;
  leaderboardEnabled: boolean;
  publicProfileEnabled: boolean;
  portabilityEnabled: boolean;
  redemptionEnabled: boolean;
  nonCashRedemptionOnly: boolean;
  automatedDecisionEnabled: boolean;
  humanReviewRequired: boolean;
  consentRequired: boolean;
  dataLocationPolicy: string;
  retentionPolicy: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  country?: Country;
  _count?: {
    organizations: number;
  };
}

export interface Organization {
  id: string;
  name: string;
  legalName: string;
  slug: string;
  email: string;
  phone: string;
  status: 'ACTIVE' | 'INACTIVE';
  countryCode: string;
  countryName: string;
  jurisdictionPolicyVersion: number;
  jurisdictionPolicyId?: string | null;
  jurisdictionPolicy?: JurisdictionPolicy | null;
  country?: Country;
  timezone: string;
  currency: string;
  bpPolicy?: any;
  bpAccount?: {
    id: string;
    purchasedBP: number;
    allocatedBP: number;
    availableBP: number;
  };
  _count?: {
    employees: number;
    users: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface BPTransaction {
  id: string;
  organizationId: string;
  employeeId?: string | null;
  type: 'PURCHASE' | 'ALLOCATION' | 'RECOGNITION' | 'WELLNESS' | 'REDEMPTION' | 'REFUND' | 'ADJUSTMENT';
  amount: number;
  reference: string;
  description: string;
  createdByUserId?: string | null;
  createdAt: string;
  employee?: {
    user: {
      firstName: string;
      lastName: string;
      email: string;
    };
  };
}

export interface Employee {
  id: string;
  userId: string;
  organizationId: string;
  employeeCode: string;
  department: string;
  designation: string;
  joiningDate: string;
  status: 'ACTIVE' | 'INACTIVE';
  onboardingStatus: OnboardingStatus;
  invitationExpiresAt?: string | null;
  onboardingCompletedAt?: string | null;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    status: string;
  };
  wallet?: EmployeeWallet;
  organization?: OrganizationSummary;
}

export interface IkigaiQuestion {
  id: string;
  questionnaireId: string;
  dimension: IkigaiDimension;
  questionText: string;
  questionType: IkigaiQuestionType;
  options?: any;
  displayOrder: number;
  isRequired: boolean;
  isActive: boolean;
}

export interface IkigaiQuestionnaire {
  id: string;
  version: number;
  title: string;
  description?: string;
  isActive: boolean;
  questions: IkigaiQuestion[];
  dimensions?: Record<IkigaiDimension, IkigaiQuestion[]>;
}

export interface IkigaiResponse {
  id: string;
  organizationId: string;
  employeeId: string;
  questionnaireId: string;
  questionId: string;
  dimension: IkigaiDimension;
  response: string;
  createdAt: string;
  updatedAt: string;
  question?: IkigaiQuestion;
}
