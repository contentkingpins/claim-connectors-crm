// Claim status enum
export enum ClaimStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  ADDITIONAL_INFO_NEEDED = 'ADDITIONAL_INFO_NEEDED',
  APPROVED = 'APPROVED',
  PARTIALLY_APPROVED = 'PARTIALLY_APPROVED',
  REJECTED = 'REJECTED',
  APPEALED = 'APPEALED',
  CLOSED = 'CLOSED',
}

// Claim type enum
export enum ClaimType {
  EMPLOYEE_RETENTION_CREDIT = 'EMPLOYEE_RETENTION_CREDIT',
  RESEARCH_AND_DEVELOPMENT = 'RESEARCH_AND_DEVELOPMENT',
  WORK_OPPORTUNITY_TAX_CREDIT = 'WORK_OPPORTUNITY_TAX_CREDIT',
  DISASTER_RELIEF = 'DISASTER_RELIEF',
  BUSINESS_ENERGY_CREDIT = 'BUSINESS_ENERGY_CREDIT',
  OTHER = 'OTHER',
}

// Claim priority enum
export enum ClaimPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

// Claim interface
export interface Claim {
  id: string;
  leadId: string;
  firmId: string;
  cpaId: string;
  claimNumber: string;
  claimType: ClaimType;
  status: ClaimStatus;
  priority: ClaimPriority;
  submissionDate: string;
  taxYear: number;
  claimAmount: number;
  approvedAmount?: number;
  rejectionReason?: string;
  notes?: string;
  assignedAgentId?: string;
  lastUpdated: string;
  expectedCompletionDate?: string;
  completedDate?: string;
  documents?: string[]; // Array of document IDs
  tags?: string[];
  clientBusinessName: string;
  clientEIN: string;
  clientContactName: string;
  clientContactEmail: string;
  clientContactPhone?: string;
}

// Claim creation input interface
export interface CreateClaimInput {
  leadId: string;
  firmId: string;
  cpaId: string;
  claimType: ClaimType;
  status: ClaimStatus;
  priority: ClaimPriority;
  submissionDate: string;
  taxYear: number;
  claimAmount: number;
  notes?: string;
  assignedAgentId?: string;
  expectedCompletionDate?: string;
  tags?: string[];
  clientBusinessName: string;
  clientEIN: string;
  clientContactName: string;
  clientContactEmail: string;
  clientContactPhone?: string;
}

// Claim update input interface
export interface UpdateClaimInput {
  claimType?: ClaimType;
  status?: ClaimStatus;
  priority?: ClaimPriority;
  claimAmount?: number;
  approvedAmount?: number;
  rejectionReason?: string;
  notes?: string;
  assignedAgentId?: string;
  expectedCompletionDate?: string;
  completedDate?: string;
  documents?: string[];
  tags?: string[];
  clientContactName?: string;
  clientContactEmail?: string;
  clientContactPhone?: string;
}

// Claim query parameters interface
export interface ClaimQueryParams {
  leadId?: string;
  firmId?: string;
  cpaId?: string;
  status?: ClaimStatus;
  claimType?: ClaimType;
  priority?: ClaimPriority;
  assignedAgentId?: string;
  fromDate?: string;
  toDate?: string;
  minAmount?: number;
  maxAmount?: number;
  taxYear?: number;
  searchTerm?: string;
  limit?: number;
  offset?: number;
}

// Claim list response interface
export interface ClaimListResponse {
  claims: Claim[];
  total: number;
  limit: number;
  offset: number;
}

// Claim statistics interface
export interface ClaimStatistics {
  totalClaims: number;
  totalClaimAmount: number;
  totalApprovedAmount: number;
  approvalRate: number;
  averageProcessingTime: number; // in days
  claimsByStatus: Record<ClaimStatus, number>;
  claimsByType: Record<ClaimType, number>;
  claimsByPriority: Record<ClaimPriority, number>;
}

// Claim timeline event interface
export interface ClaimTimelineEvent {
  id: string;
  claimId: string;
  eventType: string;
  description: string;
  timestamp: string;
  userId: string;
  userName: string;
  additionalData?: Record<string, any>;
} 