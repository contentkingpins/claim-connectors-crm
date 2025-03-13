// Lead status enum
export enum LeadStatus {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  QUALIFIED = 'QUALIFIED',
  PROPOSAL = 'PROPOSAL',
  NEGOTIATION = 'NEGOTIATION',
  WON = 'WON',
  LOST = 'LOST',
}

// Lead source enum
export enum LeadSource {
  WEBSITE = 'WEBSITE',
  REFERRAL = 'REFERRAL',
  COLD_CALL = 'COLD_CALL',
  SOCIAL_MEDIA = 'SOCIAL_MEDIA',
  EMAIL_CAMPAIGN = 'EMAIL_CAMPAIGN',
  EVENT = 'EVENT',
  OTHER = 'OTHER',
  GOOGLE = 'GOOGLE',
}

// Address interface
export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// Lead interface
export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  status: LeadStatus;
  source: LeadSource;
  notes?: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  lastContactedAt?: string;
  estimatedValue?: number;
  tags?: string[];
  address?: Address;
}

// Lead creation input interface
export interface CreateLeadInput {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  status: LeadStatus;
  source: LeadSource;
  notes?: string;
  assignedTo?: string;
  estimatedValue?: number;
  tags?: string[];
  address?: Address;
}

// Lead update input interface
export interface UpdateLeadInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  company?: string;
  status?: LeadStatus;
  source?: LeadSource;
  notes?: string;
  assignedTo?: string;
  lastContactedAt?: string;
  estimatedValue?: number;
  tags?: string[];
  address?: Address;
}

// Lead query parameters interface
export interface LeadQueryParams {
  status?: LeadStatus;
  source?: LeadSource;
  assignedTo?: string;
  fromDate?: string;
  toDate?: string;
  searchTerm?: string;
  limit?: number;
  offset?: number;
}

// Lead list response interface
export interface LeadListResponse {
  leads: Lead[];
  total: number;
  limit: number;
  offset: number;
} 