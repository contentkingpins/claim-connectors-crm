import { z } from 'zod';

// Document type enum
export enum DocumentType {
  CONTRACT = 'CONTRACT',
  PROPOSAL = 'PROPOSAL',
  INVOICE = 'INVOICE',
  CLAIM_FORM = 'CLAIM_FORM',
  IDENTIFICATION = 'IDENTIFICATION',
  INSURANCE_POLICY = 'INSURANCE_POLICY',
  MEDICAL_RECORD = 'MEDICAL_RECORD',
  OTHER = 'OTHER',
}

// Document schema for validation
export const documentSchema = z.object({
  id: z.string().uuid(),
  leadId: z.string().uuid(),
  fileName: z.string().min(1).max(255),
  fileType: z.string().min(1).max(50),
  fileSize: z.number().min(0),
  documentType: z.nativeEnum(DocumentType),
  description: z.string().max(1000).optional(),
  s3Key: z.string().min(1),
  uploadedBy: z.string().uuid(),
  uploadedAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  tags: z.array(z.string()).optional(),
  isPublic: z.boolean().default(false),
});

// Document type
export type Document = z.infer<typeof documentSchema>;

// Document creation input schema
export const createDocumentSchema = z.object({
  leadId: z.string().uuid(),
  fileName: z.string().min(1).max(255),
  fileType: z.string().min(1).max(50),
  fileSize: z.number().min(0),
  documentType: z.nativeEnum(DocumentType),
  description: z.string().max(1000).optional(),
  tags: z.array(z.string()).optional(),
  isPublic: z.boolean().default(false),
});

// Document update input schema
export const updateDocumentSchema = z.object({
  documentType: z.nativeEnum(DocumentType).optional(),
  description: z.string().max(1000).optional(),
  tags: z.array(z.string()).optional(),
  isPublic: z.boolean().optional(),
});

// Document query parameters schema
export const documentQuerySchema = z.object({
  leadId: z.string().uuid().optional(),
  documentType: z.nativeEnum(DocumentType).optional(),
  uploadedBy: z.string().uuid().optional(),
  fromDate: z.string().datetime().optional(),
  toDate: z.string().datetime().optional(),
  searchTerm: z.string().optional(),
  limit: z.number().min(1).max(100).default(20),
  nextToken: z.string().optional(),
});

export type DocumentQuery = z.infer<typeof documentQuerySchema>;

// Upload URL request schema
export const uploadUrlRequestSchema = z.object({
  leadId: z.string().uuid(),
  fileName: z.string().min(1).max(255),
  fileType: z.string().min(1).max(50),
  fileSize: z.number().min(0),
  documentType: z.nativeEnum(DocumentType),
  description: z.string().max(1000).optional(),
  tags: z.array(z.string()).optional(),
  isPublic: z.boolean().default(false),
});

export type UploadUrlRequest = z.infer<typeof uploadUrlRequestSchema>; 