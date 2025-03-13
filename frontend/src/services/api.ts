import axios, { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { Auth } from 'aws-amplify';
import { 
  Lead, 
  CreateLeadInput, 
  UpdateLeadInput, 
  LeadQueryParams, 
  LeadListResponse 
} from '../types/Lead';
import { 
  Document, 
  UpdateDocumentInput, 
  DocumentQueryParams, 
  DocumentListResponse,
  UploadUrlRequest,
  UploadUrlResponse,
  DownloadUrlResponse
} from '../types/Document';
import { 
  Call, 
  CreateCallInput, 
  UpdateCallInput, 
  CallQueryParams, 
  CallListResponse,
  RecordingUrlResponse
} from '../types/Call';
import {
  FirmPerformance,
  CPAPerformance,
  MonthlyStats,
  PerformanceComparison
} from '../types/Performance';
import {
  Claim, CreateClaimInput, UpdateClaimInput, ClaimQueryParams,
  ClaimListResponse, ClaimStatistics, ClaimTimelineEvent
} from '../types/Claim';

// Flag to toggle between mock and real API
const USE_MOCK_API = process.env.REACT_APP_USE_MOCK_API === 'true';

// Import mock API if needed
let mockApiModule: any = null;
if (USE_MOCK_API) {
  import('./mockApi').then((module) => {
    mockApiModule = module.mockApi;
  });
}

// Create axios instance for real API
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_ENDPOINT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Get token from Auth (AWS Amplify)
    try {
      const session = await Auth.currentSession();
      const token = session.getIdToken().getJwtToken();
      
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API service
const api = {
  // Leads API
  leads: {
    list: async (params: LeadQueryParams = {}): Promise<LeadListResponse> => {
      if (USE_MOCK_API && mockApiModule) {
        return mockApiModule.leads.list(params);
      } else {
        const response = await apiClient.get('/leads', { params });
        return response.data;
      }
    },
    
    get: async (id: string): Promise<Lead> => {
      if (USE_MOCK_API && mockApiModule) {
        return mockApiModule.leads.get(id);
      } else {
        const response = await apiClient.get(`/leads/${id}`);
        return response.data;
      }
    },
    
    create: async (data: CreateLeadInput): Promise<Lead> => {
      if (USE_MOCK_API && mockApiModule) {
        return mockApiModule.leads.create(data);
      } else {
        const response = await apiClient.post('/leads', data);
        return response.data;
      }
    },
    
    update: async (id: string, data: UpdateLeadInput): Promise<Lead> => {
      if (USE_MOCK_API && mockApiModule) {
        return mockApiModule.leads.update(id, data);
      } else {
        const response = await apiClient.put(`/leads/${id}`, data);
        return response.data;
      }
    },
    
    delete: async (id: string): Promise<{ success: boolean }> => {
      if (USE_MOCK_API && mockApiModule) {
        return mockApiModule.leads.delete(id);
      } else {
        await apiClient.delete(`/leads/${id}`);
        return { success: true };
      }
    },
  },
  
  // Documents API
  documents: {
    list: async (params: DocumentQueryParams = {}): Promise<DocumentListResponse> => {
      if (USE_MOCK_API && mockApiModule) {
        return mockApiModule.documents.list(params);
      } else {
        const response = await apiClient.get('/documents', { params });
        return response.data;
      }
    },
    
    getUploadUrl: async (data: UploadUrlRequest): Promise<UploadUrlResponse> => {
      if (USE_MOCK_API && mockApiModule) {
        return mockApiModule.documents.getUploadUrl(data);
      } else {
        const response = await apiClient.post('/documents/upload-url', data);
        return response.data;
      }
    },
    
    getDownloadUrl: async (id: string): Promise<DownloadUrlResponse> => {
      if (USE_MOCK_API && mockApiModule) {
        return mockApiModule.documents.getDownloadUrl(id);
      } else {
        const response = await apiClient.get(`/documents/${id}/download-url`);
        return response.data;
      }
    },
    
    update: async (id: string, data: UpdateDocumentInput): Promise<Document> => {
      if (USE_MOCK_API && mockApiModule) {
        return mockApiModule.documents.update(id, data);
      } else {
        const response = await apiClient.put(`/documents/${id}`, data);
        return response.data;
      }
    },
    
    delete: async (id: string): Promise<{ success: boolean }> => {
      if (USE_MOCK_API && mockApiModule) {
        return mockApiModule.documents.delete(id);
      } else {
        await apiClient.delete(`/documents/${id}`);
        return { success: true };
      }
    },
  },
  
  // Calls API
  calls: {
    list: async (params: CallQueryParams = {}): Promise<CallListResponse> => {
      if (USE_MOCK_API && mockApiModule) {
        return mockApiModule.calls.list(params);
      } else {
        const response = await apiClient.get('/calls', { params });
        return response.data;
      }
    },
    
    saveMetadata: async (data: CreateCallInput): Promise<Call> => {
      if (USE_MOCK_API && mockApiModule) {
        return mockApiModule.calls.saveMetadata(data);
      } else {
        const response = await apiClient.post('/calls', data);
        return response.data;
      }
    },
    
    getRecordingUrl: async (id: string): Promise<RecordingUrlResponse> => {
      if (USE_MOCK_API && mockApiModule) {
        return mockApiModule.calls.getRecordingUrl(id);
      } else {
        const response = await apiClient.get(`/calls/${id}/recording`);
        return response.data;
      }
    },
    
    updateNotes: async (id: string, data: UpdateCallInput): Promise<Call> => {
      if (USE_MOCK_API && mockApiModule) {
        return mockApiModule.calls.updateNotes(id, data);
      } else {
        const response = await apiClient.put(`/calls/${id}/notes`, data);
        return response.data;
      }
    },
  },
  
  // Firm Performance API
  firmPerformance: {
    list: async (): Promise<FirmPerformance[]> => {
      if (USE_MOCK_API && mockApiModule) {
        return mockApiModule.firmPerformance.list();
      } else {
        const response = await apiClient.get('/firms/performance');
        return response.data;
      }
    },
    
    get: async (id: string): Promise<FirmPerformance> => {
      if (USE_MOCK_API && mockApiModule) {
        return mockApiModule.firmPerformance.get(id);
      } else {
        const response = await apiClient.get(`/firms/${id}/performance`);
        return response.data;
      }
    },
    
    getMonthlyStats: async (id: string): Promise<MonthlyStats[]> => {
      if (USE_MOCK_API && mockApiModule) {
        return mockApiModule.firmPerformance.getMonthlyStats(id);
      } else {
        const response = await apiClient.get(`/firms/${id}/monthly-stats`);
        return response.data;
      }
    },
    
    getComparison: async (): Promise<PerformanceComparison[]> => {
      if (USE_MOCK_API && mockApiModule) {
        return mockApiModule.firmPerformance.getComparison();
      } else {
        const response = await apiClient.get<PerformanceComparison[]>('/firms/comparison');
        return response.data;
      }
    },
  },
  
  // CPA Performance API
  cpaPerformance: {
    list: async (): Promise<CPAPerformance[]> => {
      if (USE_MOCK_API && mockApiModule) {
        return mockApiModule.cpaPerformance.list();
      } else {
        const response = await apiClient.get('/cpas/performance');
        return response.data;
      }
    },
    
    get: async (id: string): Promise<CPAPerformance> => {
      if (USE_MOCK_API && mockApiModule) {
        return mockApiModule.cpaPerformance.get(id);
      } else {
        const response = await apiClient.get(`/cpas/${id}/performance`);
        return response.data;
      }
    },
    
    getMonthlyStats: async (id: string): Promise<MonthlyStats[]> => {
      if (USE_MOCK_API && mockApiModule) {
        return mockApiModule.cpaPerformance.getMonthlyStats(id);
      } else {
        const response = await apiClient.get(`/cpas/${id}/monthly-stats`);
        return response.data;
      }
    },
  },

  // Claims API
  claims: {
    create: async (claim: CreateClaimInput): Promise<Claim> => {
      if (USE_MOCK_API && mockApiModule) {
        return mockApiModule.claims.create(claim);
      } else {
        const response = await apiClient.post<Claim>('/claims', claim);
        return response.data;
      }
    },
    
    get: async (id: string): Promise<Claim> => {
      if (USE_MOCK_API && mockApiModule) {
        return mockApiModule.claims.get(id);
      } else {
        const response = await apiClient.get<Claim>(`/claims/${id}`);
        return response.data;
      }
    },
    
    update: async (id: string, claim: UpdateClaimInput): Promise<Claim> => {
      if (USE_MOCK_API && mockApiModule) {
        return mockApiModule.claims.update(id, claim);
      } else {
        const response = await apiClient.put<Claim>(`/claims/${id}`, claim);
        return response.data;
      }
    },
    
    delete: async (id: string): Promise<void> => {
      if (USE_MOCK_API && mockApiModule) {
        return mockApiModule.claims.delete(id);
      } else {
        await apiClient.delete(`/claims/${id}`);
      }
    },
    
    list: async (params?: ClaimQueryParams): Promise<ClaimListResponse> => {
      if (USE_MOCK_API && mockApiModule) {
        return mockApiModule.claims.list(params);
      } else {
        const response = await apiClient.get<ClaimListResponse>('/claims', { params });
        return response.data;
      }
    },
    
    getStatistics: async (): Promise<ClaimStatistics> => {
      if (USE_MOCK_API && mockApiModule) {
        return mockApiModule.claims.getStatistics();
      } else {
        const response = await apiClient.get<ClaimStatistics>('/claims/statistics');
        return response.data;
      }
    },
    
    getTimeline: async (id: string): Promise<ClaimTimelineEvent[]> => {
      if (USE_MOCK_API && mockApiModule) {
        return mockApiModule.claims.getTimeline(id);
      } else {
        const response = await apiClient.get<ClaimTimelineEvent[]>(`/claims/${id}/timeline`);
        return response.data;
      }
    },
    
    addTimelineEvent: async (id: string, event: Omit<ClaimTimelineEvent, 'id' | 'claimId' | 'timestamp' | 'userId' | 'userName'>): Promise<ClaimTimelineEvent> => {
      if (USE_MOCK_API && mockApiModule) {
        return mockApiModule.claims.addTimelineEvent(id, event);
      } else {
        const response = await apiClient.post<ClaimTimelineEvent>(`/claims/${id}/timeline`, event);
        return response.data;
      }
    },
    
    getByFirm: async (firmId: string, params?: ClaimQueryParams): Promise<ClaimListResponse> => {
      if (USE_MOCK_API && mockApiModule) {
        return mockApiModule.claims.getByFirm(firmId, params);
      } else {
        const response = await apiClient.get<ClaimListResponse>(`/firms/${firmId}/claims`, { params });
        return response.data;
      }
    },
    
    getByCPA: async (cpaId: string, params?: ClaimQueryParams): Promise<ClaimListResponse> => {
      if (USE_MOCK_API && mockApiModule) {
        return mockApiModule.claims.getByCPA(cpaId, params);
      } else {
        const response = await apiClient.get<ClaimListResponse>(`/cpas/${cpaId}/claims`, { params });
        return response.data;
      }
    },
  },
};

export default api; 