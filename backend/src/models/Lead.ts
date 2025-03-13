import { z } from 'zod';

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
}

// Lead schema for validation
export const leadSchema = z.object({
  id: z.string().uuid(),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().min(10).max(20).optional(),
  company: z.string().min(1).max(100).optional(),
  status: z.nativeEnum(LeadStatus),
  source: z.nativeEnum(LeadSource),
  notes: z.string().max(2000).optional(),
  assignedTo: z.string().uuid().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  lastContactedAt: z.string().datetime().optional(),
  estimatedValue: z.number().min(0).optional(),
  tags: z.array(z.string()).optional(),
});

// Lead type
export type Lead = z.infer<typeof leadSchema>;

// Lead creation input schema
export const createLeadSchema = leadSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Lead update input schema
export const updateLeadSchema = createLeadSchema.partial();

// Lead query parameters schema
export const leadQuerySchema = z.object({
  status: z.nativeEnum(LeadStatus).optional(),
  source: z.nativeEnum(LeadSource).optional(),
  assignedTo: z.string().uuid().optional(),
  fromDate: z.string().datetime().optional(),
  toDate: z.string().datetime().optional(),
  searchTerm: z.string().optional(),
  limit: z.number().min(1).max(100).default(20),
  nextToken: z.string().optional(),
});

export type LeadQuery = z.infer<typeof leadQuerySchema>; 