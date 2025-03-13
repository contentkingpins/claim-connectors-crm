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

// Document interface
export interface Document {
  id: string;
  leadId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  documentType: DocumentType;
  description?: string;
  s3Key: string;
  uploadedBy: string;
  uploadedAt: string;
  updatedAt: string;
  tags?: string[];
  isPublic: boolean;
}

// Document creation input interface
export interface CreateDocumentInput {
  leadId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  documentType: DocumentType;
  description?: string;
  tags?: string[];
  isPublic?: boolean;
}

// Document update input interface
export interface UpdateDocumentInput {
  documentType?: DocumentType;
  description?: string;
  tags?: string[];
  isPublic?: boolean;
}

// Document query parameters interface
export interface DocumentQueryParams {
  leadId?: string;
  documentType?: DocumentType;
  uploadedBy?: string;
  fromDate?: string;
  toDate?: string;
  searchTerm?: string;
  limit?: number;
  offset?: number;
}

// Document list response interface
export interface DocumentListResponse {
  documents: Document[];
  total: number;
  limit: number;
  offset: number;
}

// Upload URL request interface
export interface UploadUrlRequest {
  leadId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  documentType: DocumentType;
  description?: string;
  tags?: string[];
  isPublic?: boolean;
}

// Upload URL response interface
export interface UploadUrlResponse {
  documentId: string;
  uploadUrl: string;
  s3Key: string;
}

// Download URL response interface
export interface DownloadUrlResponse {
  downloadUrl: string;
} 