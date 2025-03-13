import axios from 'axios';
// Remove aws-amplify import if not installed
// import { Auth } from 'aws-amplify';
import mockApi from './mockApi';
import { Lead } from '../types/Lead';
import { Document, DocumentType } from '../types/Document';
import { Call } from '../types/Call';
import { Claim, ClaimStatus, ClaimType } from '../types/Claim';

// Flag to toggle between mock and real API
export const USE_MOCK_API = process.env.REACT_APP_USE_MOCK_API === 'true' || true;

// Create an axios instance for API requests
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_ENDPOINT || 'https://api.claimconnectors.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the authorization token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      // Comment out Auth usage until aws-amplify is installed
      /*
      const session = await Auth.currentSession();
      const token = session.getIdToken().getJwtToken();
      config.headers.Authorization = `Bearer ${token}`;
      */
      // Temporary placeholder for token
      config.headers.Authorization = `Bearer mock-token`;
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Type definitions for API parameters
interface QueryParams {
  [key: string]: string | number | boolean | undefined;
}

interface UploadDocumentRequest {
  leadId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  documentType: DocumentType;
  description?: string;
  isPublic?: boolean;
}

interface UpdateDocumentInput {
  documentType?: DocumentType;
  description?: string;
  isPublic?: boolean;
}

// API service object
const api = {
  // Lead API methods
  leads: {
    list: async (params: QueryParams = {}) => {
      if (USE_MOCK_API) {
        return {
          leads: await mockApi.getLeads(),
          total: (await mockApi.getLeads()).length,
          limit: 20,
          offset: 0
        };
      } else {
        const response = await apiClient.get('/leads', { params });
        return response.data;
      }
    },
    
    get: async (id: string) => {
      if (USE_MOCK_API) {
        return mockApi.getLeadById(id);
      } else {
        const response = await apiClient.get(`/leads/${id}`);
        return response.data;
      }
    },
    
    create: async (data: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => {
      if (USE_MOCK_API) {
        return mockApi.createLead(data);
      } else {
        const response = await apiClient.post('/leads', data);
        return response.data;
      }
    },
    
    update: async (id: string, data: Partial<Lead>) => {
      if (USE_MOCK_API) {
        return mockApi.updateLead(id, data);
      } else {
        const response = await apiClient.put(`/leads/${id}`, data);
        return response.data;
      }
    },
    
    delete: async (id: string) => {
      if (USE_MOCK_API) {
        const success = await mockApi.deleteLead(id);
        return { success };
      } else {
        await apiClient.delete(`/leads/${id}`);
        return { success: true };
      }
    }
  },
  
  // Document API methods
  documents: {
    list: async (params: QueryParams = {}) => {
      if (USE_MOCK_API) {
        return {
          documents: await mockApi.getDocuments(),
          total: (await mockApi.getDocuments()).length,
          limit: 20,
          offset: 0
        };
      } else {
        const response = await apiClient.get('/documents', { params });
        return response.data;
      }
    },
    
    getUploadUrl: async (data: UploadDocumentRequest) => {
      if (USE_MOCK_API) {
        // Mock implementation for upload URL
        const document = await mockApi.uploadDocument({
          ...data,
          s3Key: `documents/${Date.now()}-${data.fileName}`,
          uploadedBy: 'mock-user-id',
          uploadedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isPublic: data.isPublic || false
        });
        
        return {
          documentId: document.id,
          uploadUrl: 'https://example.com/mock-upload-url',
          s3Key: document.s3Key
        };
      } else {
        const response = await apiClient.post('/documents/upload-url', data);
        return response.data;
      }
    },
    
    getDownloadUrl: async (id: string) => {
      if (USE_MOCK_API) {
        // Mock implementation for download URL
        return {
          downloadUrl: 'https://example.com/mock-download-url'
        };
      } else {
        const response = await apiClient.get(`/documents/${id}/download-url`);
        return response.data;
      }
    },
    
    update: async (id: string, data: UpdateDocumentInput) => {
      if (USE_MOCK_API) {
        // Mock implementation for document update
        const documents = await mockApi.getDocuments();
        const document = documents.find(doc => doc.id === id);
        if (!document) return null;
        
        return {
          ...document,
          ...data,
          updatedAt: new Date().toISOString()
        };
      } else {
        const response = await apiClient.put(`/documents/${id}`, data);
        return response.data;
      }
    },
    
    delete: async (id: string) => {
      if (USE_MOCK_API) {
        const success = await mockApi.deleteDocument(id);
        return { success };
      } else {
        await apiClient.delete(`/documents/${id}`);
        return { success: true };
      }
    }
  },
  
  // Call API methods
  calls: {
    list: async (params: QueryParams = {}) => {
      if (USE_MOCK_API) {
        return {
          calls: await mockApi.getCalls(),
          total: (await mockApi.getCalls()).length,
          limit: 20,
          offset: 0
        };
      } else {
        const response = await apiClient.get('/calls', { params });
        return response.data;
      }
    },
    
    saveMetadata: async (data: Omit<Call, 'id'>) => {
      if (USE_MOCK_API) {
        return mockApi.createCall(data);
      } else {
        const response = await apiClient.post('/calls', data);
        return response.data;
      }
    },
    
    getRecordingUrl: async (id: string) => {
      if (USE_MOCK_API) {
        // Mock implementation for recording URL
        return {
          recordingUrl: 'https://example.com/mock-recording-url'
        };
      } else {
        const response = await apiClient.get(`/calls/${id}/recording`);
        return response.data;
      }
    },
    
    updateNotes: async (id: string, data: Partial<Call>) => {
      if (USE_MOCK_API) {
        return mockApi.updateCall(id, data);
      } else {
        const response = await apiClient.put(`/calls/${id}/notes`, data);
        return response.data;
      }
    }
  },
  
  // Firm performance API methods
  firmPerformance: {
    list: async () => {
      if (USE_MOCK_API) {
        return mockApi.getFirmPerformance();
      } else {
        const response = await apiClient.get('/firms/performance');
        return response.data;
      }
    },
    
    get: async (id: string) => {
      if (USE_MOCK_API) {
        // For mock, we just return the same firm performance data
        return mockApi.getFirmPerformance();
      } else {
        const response = await apiClient.get(`/firms/${id}/performance`);
        return response.data;
      }
    },
    
    getMonthlyStats: async (id: string) => {
      if (USE_MOCK_API) {
        // Mock implementation for monthly stats
        const firmPerformance = await mockApi.getFirmPerformance();
        return firmPerformance.monthlyStats || [];
      } else {
        const response = await apiClient.get(`/firms/${id}/monthly-stats`);
        return response.data;
      }
    },
    
    getComparison: async () => {
      if (USE_MOCK_API) {
        // Mock implementation for performance comparison
        return [
          {
            id: '1',
            name: 'Smith & Associates',
            successRate: 78.5,
            totalClaims: 200,
            averageClaimValue: 45000,
            clientSatisfactionScore: 92
          },
          {
            id: '2',
            name: 'Johnson Tax Group',
            successRate: 72.3,
            totalClaims: 180,
            averageClaimValue: 42000,
            clientSatisfactionScore: 88
          },
          {
            id: '3',
            name: 'Williams Financial',
            successRate: 81.2,
            totalClaims: 150,
            averageClaimValue: 48000,
            clientSatisfactionScore: 94
          }
        ];
      } else {
        const response = await apiClient.get('/firms/comparison');
        return response.data;
      }
    }
  },
  
  // CPA performance API methods
  cpaPerformance: {
    list: async () => {
      if (USE_MOCK_API) {
        return mockApi.getCPAPerformance();
      } else {
        const response = await apiClient.get('/cpas/performance');
        return response.data;
      }
    },
    
    get: async (id: string) => {
      if (USE_MOCK_API) {
        return mockApi.getCPAPerformanceById(id);
      } else {
        const response = await apiClient.get(`/cpas/${id}/performance`);
        return response.data;
      }
    },
    
    getMonthlyStats: async (id: string) => {
      if (USE_MOCK_API) {
        // Mock implementation for monthly stats
        const cpaPerformance = await mockApi.getCPAPerformanceById(id);
        return cpaPerformance?.monthlyStats || [];
      } else {
        const response = await apiClient.get(`/cpas/${id}/monthly-stats`);
        return response.data;
      }
    }
  },
  
  // Claims API methods
  claims: {
    create: async (claim: Omit<Claim, 'id'>) => {
      if (USE_MOCK_API) {
        return mockApi.createClaim(claim);
      } else {
        const response = await apiClient.post('/claims', claim);
        return response.data;
      }
    },
    
    get: async (id: string) => {
      if (USE_MOCK_API) {
        return mockApi.getClaimById(id);
      } else {
        const response = await apiClient.get(`/claims/${id}`);
        return response.data;
      }
    },
    
    update: async (id: string, claim: Partial<Claim>) => {
      if (USE_MOCK_API) {
        return mockApi.updateClaim(id, claim);
      } else {
        const response = await apiClient.put(`/claims/${id}`, claim);
        return response.data;
      }
    },
    
    delete: async (id: string) => {
      if (USE_MOCK_API) {
        await mockApi.deleteClaim(id);
        return { success: true };
      } else {
        await apiClient.delete(`/claims/${id}`);
        return { success: true };
      }
    },
    
    list: async (params: QueryParams = {}) => {
      if (USE_MOCK_API) {
        return {
          claims: await mockApi.getClaims(),
          total: (await mockApi.getClaims()).length,
          limit: 20,
          offset: 0
        };
      } else {
        const response = await apiClient.get('/claims', { params });
        return response.data;
      }
    },
    
    getStatistics: async () => {
      if (USE_MOCK_API) {
        // Mock implementation for claim statistics
        const claims = await mockApi.getClaims();
        const totalClaims = claims.length;
        const totalClaimAmount = claims.reduce((sum, claim) => sum + claim.claimAmount, 0);
        const approvedClaims = claims.filter(claim => claim.status === ClaimStatus.APPROVED);
        const totalApprovedAmount = approvedClaims.reduce((sum, claim) => sum + (claim.approvedAmount || claim.claimAmount), 0);
        
        // Create a record of claim counts by status
        const claimsByStatus: Record<string, number> = {};
        Object.values(ClaimStatus).forEach(status => {
          claimsByStatus[status] = claims.filter(claim => claim.status === status).length;
        });
        
        // Create a record of claim counts by type
        const claimsByType: Record<string, number> = {};
        Object.values(ClaimType).forEach(type => {
          claimsByType[type] = claims.filter(claim => claim.claimType === type).length;
        });
        
        return {
          totalClaims,
          totalClaimAmount,
          totalApprovedAmount,
          approvalRate: totalClaims > 0 ? (approvedClaims.length / totalClaims) * 100 : 0,
          averageProcessingTime: 14, // Mock average processing time in days
          claimsByStatus,
          claimsByType,
          claimsByPriority: {
            LOW: claims.filter(claim => claim.priority === 'LOW').length,
            MEDIUM: claims.filter(claim => claim.priority === 'MEDIUM').length,
            HIGH: claims.filter(claim => claim.priority === 'HIGH').length,
            URGENT: claims.filter(claim => claim.priority === 'URGENT').length
          }
        };
      } else {
        const response = await apiClient.get('/claims/statistics');
        return response.data;
      }
    },
    
    getTimeline: async (id: string) => {
      if (USE_MOCK_API) {
        const claim = await mockApi.getClaimById(id);
        // @ts-ignore - timeline property might not exist in the type but it does in our mock data
        return claim?.timeline || [];
      } else {
        const response = await apiClient.get(`/claims/${id}/timeline`);
        return response.data;
      }
    },
    
    addTimelineEvent: async (id: string, event: { action: string; description: string; createdBy: string }) => {
      if (USE_MOCK_API) {
        return mockApi.addClaimTimelineEntry(id, event);
      } else {
        const response = await apiClient.post(`/claims/${id}/timeline`, event);
        return response.data;
      }
    },
    
    getByFirm: async (firmId: string, params: QueryParams = {}) => {
      if (USE_MOCK_API) {
        const claims = await mockApi.getClaims();
        const firmClaims = claims.filter(claim => claim.firmId === firmId);
        return {
          claims: firmClaims,
          total: firmClaims.length,
          limit: 20,
          offset: 0
        };
      } else {
        const response = await apiClient.get(`/firms/${firmId}/claims`, { params });
        return response.data;
      }
    },
    
    getByLeadId: async (leadId: string, params: QueryParams = {}) => {
      if (USE_MOCK_API) {
        return mockApi.getClaimsByLeadId(leadId);
      } else {
        const response = await apiClient.get(`/leads/${leadId}/claims`, { params });
        return response.data;
      }
    }
  }
};

export default api; 