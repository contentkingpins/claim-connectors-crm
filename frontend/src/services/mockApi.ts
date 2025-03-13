import { v4 as uuidv4 } from 'uuid';
import { LeadStatus, LeadSource } from '../types/Lead';
import { DocumentType } from '../types/Document';
import { CallDirection, CallOutcome } from '../types/Call';

// Delay to simulate network latency
const MOCK_API_DELAY = 500;

// Helper function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generate random date within the last 30 days
const getRandomDate = (daysBack = 30) => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysBack));
  return date.toISOString();
};

// Generate mock leads data
const generateMockLeads = (count = 50) => {
  const leads = [];
  const statuses = Object.values(LeadStatus);
  const sources = Object.values(LeadSource);
  
  const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Lisa', 'William', 'Jessica'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia', 'Rodriguez', 'Wilson'];
  const companies = ['ABC Insurance', 'XYZ Corp', 'Acme Inc', 'Global Services', 'Metro Insurance', 'City Financial', 'United Claims', 'Liberty Group', 'Pacific Trust', 'Atlantic Partners'];
  
  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const company = Math.random() > 0.3 ? companies[Math.floor(Math.random() * companies.length)] : undefined;
    
    leads.push({
      id: uuidv4(),
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      phone: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      company,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      source: sources[Math.floor(Math.random() * sources.length)],
      notes: Math.random() > 0.5 ? `Notes for ${firstName} ${lastName}` : undefined,
      assignedTo: Math.random() > 0.3 ? uuidv4() : undefined,
      createdAt: getRandomDate(60),
      updatedAt: getRandomDate(30),
      lastContactedAt: Math.random() > 0.4 ? getRandomDate(15) : undefined,
      estimatedValue: Math.random() > 0.3 ? Math.floor(Math.random() * 50000) + 5000 : undefined,
      tags: Math.random() > 0.6 ? ['important', 'follow-up'] : undefined,
    });
  }
  
  // Sort by createdAt date, newest first
  return leads.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

// Generate mock documents data
const generateMockDocuments = (leads: any[], count = 100) => {
  const documents = [];
  const documentTypes = Object.values(DocumentType);
  const fileTypes = ['pdf', 'docx', 'jpg', 'png', 'txt'];
  const fileNames = ['Insurance_Claim', 'Medical_Report', 'Accident_Photos', 'Policy_Document', 'ID_Verification', 'Contract', 'Invoice', 'Receipt', 'Statement', 'Form'];
  
  for (let i = 0; i < count; i++) {
    const lead = leads[Math.floor(Math.random() * leads.length)];
    const fileType = fileTypes[Math.floor(Math.random() * fileTypes.length)];
    const fileName = `${fileNames[Math.floor(Math.random() * fileNames.length)]}_${Math.floor(Math.random() * 1000)}.${fileType}`;
    const documentType = documentTypes[Math.floor(Math.random() * documentTypes.length)];
    
    documents.push({
      id: uuidv4(),
      leadId: lead.id,
      fileName,
      fileType,
      fileSize: Math.floor(Math.random() * 5000000) + 10000, // 10KB to 5MB
      documentType,
      description: Math.random() > 0.5 ? `Description for ${fileName}` : undefined,
      s3Key: `documents/${lead.id}/${uuidv4()}-${fileName}`,
      uploadedBy: uuidv4(),
      uploadedAt: getRandomDate(45),
      updatedAt: getRandomDate(15),
      tags: Math.random() > 0.7 ? ['verified', 'processed'] : undefined,
      isPublic: Math.random() > 0.8,
    });
  }
  
  // Sort by uploadedAt date, newest first
  return documents.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
};

// Generate mock calls data
const generateMockCalls = (leads: any[], count = 150) => {
  const calls = [];
  const directions = Object.values(CallDirection);
  const outcomes = Object.values(CallOutcome);
  
  for (let i = 0; i < count; i++) {
    const lead = leads[Math.floor(Math.random() * leads.length)];
    const direction = directions[Math.floor(Math.random() * directions.length)];
    const outcome = outcomes[Math.floor(Math.random() * outcomes.length)];
    const startTime = getRandomDate(30);
    const duration = Math.floor(Math.random() * 900) + 30; // 30 seconds to 15 minutes
    
    // Calculate end time by adding duration to start time
    const endTimeDate = new Date(startTime);
    endTimeDate.setSeconds(endTimeDate.getSeconds() + duration);
    const endTime = endTimeDate.toISOString();
    
    calls.push({
      id: uuidv4(),
      leadId: lead.id,
      agentId: uuidv4(),
      direction,
      outcome,
      startTime,
      endTime,
      duration,
      recordingUrl: Math.random() > 0.3 ? `https://example.com/recordings/${uuidv4()}` : undefined,
      recordingS3Key: Math.random() > 0.3 ? `recordings/${lead.id}/${uuidv4()}.mp3` : undefined,
      notes: Math.random() > 0.6 ? `Call notes for ${lead.firstName} ${lead.lastName}` : undefined,
      tags: Math.random() > 0.7 ? ['important', 'follow-up'] : undefined,
      connectContactId: uuidv4(),
      queueName: Math.random() > 0.5 ? 'Main Queue' : 'Support Queue',
      transferredFrom: Math.random() > 0.9 ? uuidv4() : undefined,
      transferredTo: Math.random() > 0.9 ? uuidv4() : undefined,
    });
  }
  
  // Sort by startTime date, newest first
  return calls.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
};

// Generate mock firm performance data
const generateMockFirmPerformance = (count = 10) => {
  const firms = [];
  const firmNames = ['Smith & Associates', 'Johnson Legal Group', 'Williams Law Firm', 'Brown & Partners', 'Davis Claims Services', 
                     'Miller & Sons', 'Wilson Legal', 'Taylor Associates', 'Anderson Claims', 'Thomas & Co'];
  
  for (let i = 0; i < count; i++) {
    const totalClaims = Math.floor(Math.random() * 500) + 50;
    const successfulClaims = Math.floor(Math.random() * totalClaims);
    const pendingClaims = Math.floor(Math.random() * (totalClaims - successfulClaims));
    const rejectedClaims = totalClaims - successfulClaims - pendingClaims;
    
    firms.push({
      id: uuidv4(),
      name: firmNames[i],
      totalClaims,
      successfulClaims,
      pendingClaims,
      rejectedClaims,
      successRate: (successfulClaims / totalClaims) * 100,
      averageClaimValue: Math.floor(Math.random() * 50000) + 10000,
      averageProcessingTime: Math.floor(Math.random() * 60) + 15, // 15-75 days
      totalRevenue: Math.floor(Math.random() * 5000000) + 500000,
      clientSatisfactionScore: Math.floor(Math.random() * 50) + 50, // 50-100
      lastUpdated: getRandomDate(7),
    });
  }
  
  // Sort by successRate, highest first
  return firms.sort((a, b) => b.successRate - a.successRate);
};

// Generate mock CPA performance data
const generateMockCPAPerformance = (count = 15) => {
  const cpas = [];
  const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Lisa', 'William', 'Jessica', 'Richard', 'Jennifer', 'Thomas', 'Elizabeth', 'Daniel'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia', 'Rodriguez', 'Wilson', 'Martinez', 'Anderson', 'Taylor', 'Thomas', 'Moore'];
  
  for (let i = 0; i < count; i++) {
    const totalClaims = Math.floor(Math.random() * 200) + 20;
    const successfulClaims = Math.floor(Math.random() * totalClaims);
    const pendingClaims = Math.floor(Math.random() * (totalClaims - successfulClaims));
    const rejectedClaims = totalClaims - successfulClaims - pendingClaims;
    
    cpas.push({
      id: uuidv4(),
      firstName: firstNames[i],
      lastName: lastNames[i],
      email: `${firstNames[i].toLowerCase()}.${lastNames[i].toLowerCase()}@example.com`,
      phone: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      totalClaims,
      successfulClaims,
      pendingClaims,
      rejectedClaims,
      successRate: (successfulClaims / totalClaims) * 100,
      averageClaimValue: Math.floor(Math.random() * 40000) + 8000,
      averageProcessingTime: Math.floor(Math.random() * 50) + 10, // 10-60 days
      totalRevenue: Math.floor(Math.random() * 2000000) + 200000,
      clientSatisfactionScore: Math.floor(Math.random() * 40) + 60, // 60-100
      lastUpdated: getRandomDate(10),
      specialties: ['Tax Credits', 'Business Consulting', 'Financial Planning', 'Audit Services', 'Tax Preparation'].slice(0, Math.floor(Math.random() * 3) + 1),
    });
  }
  
  // Sort by successRate, highest first
  return cpas.sort((a, b) => b.successRate - a.successRate);
};

// Generate all mock data
const mockLeads = generateMockLeads();
const mockDocuments = generateMockDocuments(mockLeads);
const mockCalls = generateMockCalls(mockLeads);
const mockFirmPerformance = generateMockFirmPerformance();
const mockCPAPerformance = generateMockCPAPerformance();

// Mock API functions
export const mockApi = {
  // Leads API
  leads: {
    list: async (params: any = {}) => {
      await delay(MOCK_API_DELAY);
      
      let filteredLeads = [...mockLeads];
      
      // Apply filters if provided
      if (params.status) {
        filteredLeads = filteredLeads.filter(lead => lead.status === params.status);
      }
      
      if (params.source) {
        filteredLeads = filteredLeads.filter(lead => lead.source === params.source);
      }
      
      if (params.assignedTo) {
        filteredLeads = filteredLeads.filter(lead => lead.assignedTo === params.assignedTo);
      }
      
      if (params.searchTerm) {
        const searchTerm = params.searchTerm.toLowerCase();
        filteredLeads = filteredLeads.filter(lead => 
          lead.firstName.toLowerCase().includes(searchTerm) ||
          lead.lastName.toLowerCase().includes(searchTerm) ||
          lead.email.toLowerCase().includes(searchTerm) ||
          (lead.company && lead.company.toLowerCase().includes(searchTerm))
        );
      }
      
      // Apply pagination
      const limit = params.limit || 20;
      const offset = params.offset || 0;
      const paginatedLeads = filteredLeads.slice(offset, offset + limit);
      
      return {
        leads: paginatedLeads,
        total: filteredLeads.length,
        limit,
        offset,
      };
    },
    
    get: async (id: string) => {
      await delay(MOCK_API_DELAY);
      const lead = mockLeads.find(lead => lead.id === id);
      
      if (!lead) {
        throw new Error('Lead not found');
      }
      
      return lead;
    },
    
    create: async (data: any) => {
      await delay(MOCK_API_DELAY);
      const now = new Date().toISOString();
      const newLead = {
        id: uuidv4(),
        ...data,
        createdAt: now,
        updatedAt: now,
      };
      
      mockLeads.unshift(newLead);
      return newLead;
    },
    
    update: async (id: string, data: any) => {
      await delay(MOCK_API_DELAY);
      const leadIndex = mockLeads.findIndex(lead => lead.id === id);
      
      if (leadIndex === -1) {
        throw new Error('Lead not found');
      }
      
      const updatedLead = {
        ...mockLeads[leadIndex],
        ...data,
        updatedAt: new Date().toISOString(),
      };
      
      mockLeads[leadIndex] = updatedLead;
      return updatedLead;
    },
    
    delete: async (id: string) => {
      await delay(MOCK_API_DELAY);
      const leadIndex = mockLeads.findIndex(lead => lead.id === id);
      
      if (leadIndex === -1) {
        throw new Error('Lead not found');
      }
      
      mockLeads.splice(leadIndex, 1);
      return { success: true };
    },
  },
  
  // Documents API
  documents: {
    list: async (params: any = {}) => {
      await delay(MOCK_API_DELAY);
      
      let filteredDocuments = [...mockDocuments];
      
      // Apply filters if provided
      if (params.leadId) {
        filteredDocuments = filteredDocuments.filter(doc => doc.leadId === params.leadId);
      }
      
      if (params.documentType) {
        filteredDocuments = filteredDocuments.filter(doc => doc.documentType === params.documentType);
      }
      
      if (params.uploadedBy) {
        filteredDocuments = filteredDocuments.filter(doc => doc.uploadedBy === params.uploadedBy);
      }
      
      if (params.searchTerm) {
        const searchTerm = params.searchTerm.toLowerCase();
        filteredDocuments = filteredDocuments.filter(doc => 
          doc.fileName.toLowerCase().includes(searchTerm) ||
          (doc.description && doc.description.toLowerCase().includes(searchTerm))
        );
      }
      
      // Apply pagination
      const limit = params.limit || 20;
      const offset = params.offset || 0;
      const paginatedDocuments = filteredDocuments.slice(offset, offset + limit);
      
      return {
        documents: paginatedDocuments,
        total: filteredDocuments.length,
        limit,
        offset,
      };
    },
    
    getUploadUrl: async (data: any) => {
      await delay(MOCK_API_DELAY);
      const documentId = uuidv4();
      const s3Key = `documents/${data.leadId}/${documentId}-${data.fileName}`;
      
      // In a real implementation, this would return a pre-signed S3 URL
      return {
        documentId,
        uploadUrl: `https://example.com/upload/${s3Key}`,
        s3Key,
      };
    },
    
    getDownloadUrl: async (id: string) => {
      await delay(MOCK_API_DELAY);
      const document = mockDocuments.find(doc => doc.id === id);
      
      if (!document) {
        throw new Error('Document not found');
      }
      
      // In a real implementation, this would return a pre-signed S3 URL
      return {
        downloadUrl: `https://example.com/download/${document.s3Key}`,
      };
    },
    
    update: async (id: string, data: any) => {
      await delay(MOCK_API_DELAY);
      const docIndex = mockDocuments.findIndex(doc => doc.id === id);
      
      if (docIndex === -1) {
        throw new Error('Document not found');
      }
      
      const updatedDocument = {
        ...mockDocuments[docIndex],
        ...data,
        updatedAt: new Date().toISOString(),
      };
      
      mockDocuments[docIndex] = updatedDocument;
      return updatedDocument;
    },
    
    delete: async (id: string) => {
      await delay(MOCK_API_DELAY);
      const docIndex = mockDocuments.findIndex(doc => doc.id === id);
      
      if (docIndex === -1) {
        throw new Error('Document not found');
      }
      
      mockDocuments.splice(docIndex, 1);
      return { success: true };
    },
  },
  
  // Calls API
  calls: {
    list: async (params: any = {}) => {
      await delay(MOCK_API_DELAY);
      
      let filteredCalls = [...mockCalls];
      
      // Apply filters if provided
      if (params.leadId) {
        filteredCalls = filteredCalls.filter(call => call.leadId === params.leadId);
      }
      
      if (params.agentId) {
        filteredCalls = filteredCalls.filter(call => call.agentId === params.agentId);
      }
      
      if (params.direction) {
        filteredCalls = filteredCalls.filter(call => call.direction === params.direction);
      }
      
      if (params.outcome) {
        filteredCalls = filteredCalls.filter(call => call.outcome === params.outcome);
      }
      
      if (params.hasRecording !== undefined) {
        filteredCalls = filteredCalls.filter(call => 
          params.hasRecording ? !!call.recordingS3Key : !call.recordingS3Key
        );
      }
      
      // Apply pagination
      const limit = params.limit || 20;
      const offset = params.offset || 0;
      const paginatedCalls = filteredCalls.slice(offset, offset + limit);
      
      return {
        calls: paginatedCalls,
        total: filteredCalls.length,
        limit,
        offset,
      };
    },
    
    saveMetadata: async (data: any) => {
      await delay(MOCK_API_DELAY);
      const now = new Date().toISOString();
      const newCall = {
        id: uuidv4(),
        ...data,
        startTime: data.startTime || now,
        endTime: data.endTime || now,
      };
      
      mockCalls.unshift(newCall);
      return newCall;
    },
    
    getRecordingUrl: async (id: string) => {
      await delay(MOCK_API_DELAY);
      const call = mockCalls.find(call => call.id === id);
      
      if (!call) {
        throw new Error('Call not found');
      }
      
      if (!call.recordingS3Key) {
        throw new Error('Call has no recording');
      }
      
      // In a real implementation, this would return a pre-signed S3 URL
      return {
        recordingUrl: `https://example.com/recordings/${call.recordingS3Key}`,
      };
    },
    
    updateNotes: async (id: string, data: any) => {
      await delay(MOCK_API_DELAY);
      const callIndex = mockCalls.findIndex(call => call.id === id);
      
      if (callIndex === -1) {
        throw new Error('Call not found');
      }
      
      const updatedCall = {
        ...mockCalls[callIndex],
        notes: data.notes,
        tags: data.tags,
      };
      
      mockCalls[callIndex] = updatedCall;
      return updatedCall;
    },
  },
  
  // Firm Performance API
  firmPerformance: {
    list: async () => {
      await delay(MOCK_API_DELAY);
      return mockFirmPerformance;
    },
    
    get: async (id: string) => {
      await delay(MOCK_API_DELAY);
      const firm = mockFirmPerformance.find(firm => firm.id === id);
      
      if (!firm) {
        throw new Error('Firm not found');
      }
      
      return firm;
    },
    
    getMonthlyStats: async (id: string) => {
      await delay(MOCK_API_DELAY);
      const firm = mockFirmPerformance.find(firm => firm.id === id);
      
      if (!firm) {
        throw new Error('Firm not found');
      }
      
      // Generate 12 months of data
      const monthlyStats = [];
      const currentDate = new Date();
      
      for (let i = 0; i < 12; i++) {
        const month = new Date(currentDate);
        month.setMonth(currentDate.getMonth() - i);
        
        const totalClaims = Math.floor(Math.random() * 50) + 5;
        const successfulClaims = Math.floor(Math.random() * totalClaims);
        const pendingClaims = Math.floor(Math.random() * (totalClaims - successfulClaims));
        const rejectedClaims = totalClaims - successfulClaims - pendingClaims;
        
        monthlyStats.push({
          month: month.toISOString().substring(0, 7), // YYYY-MM format
          totalClaims,
          successfulClaims,
          pendingClaims,
          rejectedClaims,
          successRate: (successfulClaims / totalClaims) * 100,
          revenue: Math.floor(Math.random() * 500000) + 50000,
        });
      }
      
      return monthlyStats.reverse(); // Oldest to newest
    },
  },
  
  // CPA Performance API
  cpaPerformance: {
    list: async () => {
      await delay(MOCK_API_DELAY);
      return mockCPAPerformance;
    },
    
    get: async (id: string) => {
      await delay(MOCK_API_DELAY);
      const cpa = mockCPAPerformance.find(cpa => cpa.id === id);
      
      if (!cpa) {
        throw new Error('CPA not found');
      }
      
      return cpa;
    },
    
    getMonthlyStats: async (id: string) => {
      await delay(MOCK_API_DELAY);
      const cpa = mockCPAPerformance.find(cpa => cpa.id === id);
      
      if (!cpa) {
        throw new Error('CPA not found');
      }
      
      // Generate 12 months of data
      const monthlyStats = [];
      const currentDate = new Date();
      
      for (let i = 0; i < 12; i++) {
        const month = new Date(currentDate);
        month.setMonth(currentDate.getMonth() - i);
        
        const totalClaims = Math.floor(Math.random() * 20) + 2;
        const successfulClaims = Math.floor(Math.random() * totalClaims);
        const pendingClaims = Math.floor(Math.random() * (totalClaims - successfulClaims));
        const rejectedClaims = totalClaims - successfulClaims - pendingClaims;
        
        monthlyStats.push({
          month: month.toISOString().substring(0, 7), // YYYY-MM format
          totalClaims,
          successfulClaims,
          pendingClaims,
          rejectedClaims,
          successRate: (successfulClaims / totalClaims) * 100,
          revenue: Math.floor(Math.random() * 200000) + 20000,
        });
      }
      
      return monthlyStats.reverse(); // Oldest to newest
    },
  },
};

export default mockApi; 