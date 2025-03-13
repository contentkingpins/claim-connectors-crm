import { v4 as uuidv4 } from 'uuid';
import { Lead, LeadStatus, LeadSource } from '../types/Lead';
import { Document, DocumentType } from '../types/Document';
import { Call, CallDirection, CallOutcome } from '../types/Call';
import { Claim, ClaimStatus, ClaimType, ClaimPriority } from '../types/Claim';

// Mock Leads
const mockLeads: Lead[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '555-123-4567',
    company: 'Acme Inc.',
    status: LeadStatus.NEW,
    source: LeadSource.WEBSITE,
    assignedTo: 'agent1',
    notes: 'Initial contact made via website form',
    createdAt: '2023-05-10T14:30:00Z',
    updatedAt: '2023-05-10T14:30:00Z',
    tags: ['new', 'website'],
    address: {
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zipCode: '90210',
      country: 'USA'
    }
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phone: '555-987-6543',
    company: 'XYZ Corp',
    status: LeadStatus.QUALIFIED,
    source: LeadSource.REFERRAL,
    assignedTo: 'agent2',
    notes: 'Referred by existing client',
    createdAt: '2023-05-08T10:15:00Z',
    updatedAt: '2023-05-09T16:45:00Z',
    tags: ['qualified', 'referral'],
    address: {
      street: '456 Oak Ave',
      city: 'Somewhere',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    }
  },
  {
    id: '3',
    firstName: 'Robert',
    lastName: 'Johnson',
    email: 'robert.johnson@example.com',
    phone: '555-456-7890',
    company: 'Johnson Enterprises',
    status: LeadStatus.CONTACTED,
    source: LeadSource.GOOGLE,
    assignedTo: 'agent1',
    notes: 'Initial call made, follow-up scheduled',
    createdAt: '2023-05-05T09:00:00Z',
    updatedAt: '2023-05-07T11:30:00Z',
    tags: ['contacted', 'follow-up'],
    address: {
      street: '789 Pine St',
      city: 'Elsewhere',
      state: 'TX',
      zipCode: '75001',
      country: 'USA'
    }
  }
];

// Mock Documents
const mockDocuments: Document[] = [
  {
    id: '1',
    leadId: '1',
    fileName: 'tax_return_2022.pdf',
    fileType: 'application/pdf',
    fileSize: 2500000,
    s3Key: 'documents/tax_return_2022.pdf',
    documentType: DocumentType.TAX_RETURN,
    description: '2022 Tax Return',
    uploadedBy: 'agent1',
    uploadedAt: '2023-05-11T10:00:00Z',
    updatedAt: '2023-05-11T10:00:00Z',
    isPublic: false
  },
  {
    id: '2',
    leadId: '1',
    fileName: 'business_license.jpg',
    fileType: 'image/jpeg',
    fileSize: 1200000,
    s3Key: 'documents/business_license.jpg',
    documentType: DocumentType.BUSINESS_LICENSE,
    description: 'Business License',
    uploadedBy: 'agent1',
    uploadedAt: '2023-05-11T10:05:00Z',
    updatedAt: '2023-05-11T10:05:00Z',
    isPublic: true
  },
  {
    id: '3',
    leadId: '2',
    fileName: 'payroll_records_q1.xlsx',
    fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    fileSize: 1800000,
    s3Key: 'documents/payroll_records_q1.xlsx',
    documentType: DocumentType.PAYROLL_RECORDS,
    description: 'Q1 2023 Payroll Records',
    uploadedBy: 'agent2',
    uploadedAt: '2023-05-09T14:30:00Z',
    updatedAt: '2023-05-09T14:30:00Z',
    isPublic: false
  }
];

// Mock Calls
const mockCalls: Call[] = [
  {
    id: '1',
    leadId: '1',
    agentId: 'agent1',
    direction: CallDirection.OUTBOUND,
    outcome: CallOutcome.SCHEDULED_FOLLOW_UP,
    startTime: '2023-05-12T09:30:00Z',
    endTime: '2023-05-12T09:45:00Z',
    duration: 15 * 60, // 15 minutes in seconds
    notes: 'Discussed tax credit eligibility, client interested in proceeding',
    tags: ['follow-up', 'interested']
  },
  {
    id: '2',
    leadId: '2',
    agentId: 'agent2',
    direction: CallDirection.INBOUND,
    outcome: CallOutcome.REQUESTED_INFORMATION,
    startTime: '2023-05-11T14:00:00Z',
    endTime: '2023-05-11T14:20:00Z',
    duration: 20 * 60, // 20 minutes in seconds
    notes: 'Client called with questions about documentation requirements',
    tags: ['documentation', 'questions']
  },
  {
    id: '3',
    leadId: '3',
    agentId: 'agent1',
    direction: CallDirection.OUTBOUND,
    outcome: CallOutcome.LEFT_VOICEMAIL,
    startTime: '2023-05-10T11:15:00Z',
    endTime: '2023-05-10T11:17:00Z',
    duration: 2 * 60, // 2 minutes in seconds
    notes: 'Left voicemail introducing our services and requesting callback',
    tags: ['voicemail', 'introduction']
  }
];

// Mock Claims
const mockClaims: Claim[] = [
  {
    id: '1',
    leadId: '1',
    firmId: 'firm1',
    cpaId: 'cpa1',
    claimNumber: 'ERC-2023-001',
    claimType: ClaimType.EMPLOYEE_RETENTION_CREDIT,
    status: ClaimStatus.SUBMITTED,
    priority: ClaimPriority.MEDIUM,
    submissionDate: '2023-05-15T00:00:00Z',
    taxYear: 2022,
    claimAmount: 125000,
    notes: 'Complete application with all required documentation',
    assignedAgentId: 'agent1',
    lastUpdated: '2023-05-15T14:30:00Z',
    expectedCompletionDate: '2023-07-15T00:00:00Z',
    documents: ['1', '2'],
    tags: ['complete', 'priority'],
    clientBusinessName: 'Acme Inc.',
    clientEIN: '12-3456789',
    clientContactName: 'John Doe',
    clientContactEmail: 'john.doe@example.com',
    clientContactPhone: '555-123-4567'
  },
  {
    id: '2',
    leadId: '2',
    firmId: 'firm1',
    cpaId: 'cpa2',
    claimNumber: 'RD-2023-001',
    claimType: ClaimType.RESEARCH_AND_DEVELOPMENT,
    status: ClaimStatus.UNDER_REVIEW,
    priority: ClaimPriority.HIGH,
    submissionDate: '2023-05-10T00:00:00Z',
    taxYear: 2022,
    claimAmount: 250000,
    notes: 'Innovative software development project',
    assignedAgentId: 'agent2',
    lastUpdated: '2023-05-16T09:45:00Z',
    expectedCompletionDate: '2023-06-30T00:00:00Z',
    documents: ['3'],
    tags: ['tech', 'software'],
    clientBusinessName: 'XYZ Corp',
    clientEIN: '98-7654321',
    clientContactName: 'Jane Smith',
    clientContactEmail: 'jane.smith@example.com',
    clientContactPhone: '555-987-6543'
  },
  {
    id: '3',
    leadId: '3',
    firmId: 'firm2',
    cpaId: 'cpa1',
    claimNumber: 'WOTC-2023-001',
    claimType: ClaimType.WORK_OPPORTUNITY_TAX_CREDIT,
    status: ClaimStatus.DRAFT,
    priority: ClaimPriority.LOW,
    submissionDate: '2023-05-18T00:00:00Z',
    taxYear: 2023,
    claimAmount: 75000,
    notes: 'Hiring program for veterans',
    assignedAgentId: 'agent1',
    lastUpdated: '2023-05-18T11:20:00Z',
    expectedCompletionDate: '2023-08-01T00:00:00Z',
    tags: ['veterans', 'hiring'],
    clientBusinessName: 'Johnson Enterprises',
    clientEIN: '45-6789123',
    clientContactName: 'Robert Johnson',
    clientContactEmail: 'robert.johnson@example.com',
    clientContactPhone: '555-456-7890'
  }
];

// Mock Firm Performance
const mockFirmPerformance = {
  id: 'firm1',
  name: 'Smith & Associates',
  totalClaims: 150,
  approvedClaims: 120,
  rejectedClaims: 15,
  pendingClaims: 15,
  totalClaimValue: 7500000,
  approvedClaimValue: 6000000,
  successRate: 80,
  averageProcessingTime: 45, // days
  clientSatisfactionScore: 4.8,
  monthlyStats: [
    { month: '2023-01', claims: 12, approved: 10, value: 600000 },
    { month: '2023-02', claims: 15, approved: 12, value: 750000 },
    { month: '2023-03', claims: 18, approved: 15, value: 900000 },
    { month: '2023-04', claims: 20, approved: 16, value: 1000000 },
    { month: '2023-05', claims: 22, approved: 18, value: 1100000 }
  ],
  topPerformingAgents: [
    { id: 'agent1', name: 'Alice Johnson', claims: 45, successRate: 85 },
    { id: 'agent2', name: 'Bob Smith', claims: 40, successRate: 82 },
    { id: 'agent3', name: 'Carol Davis', claims: 35, successRate: 78 }
  ]
};

// Mock CPA Performance
const mockCPAPerformance = [
  {
    id: 'cpa1',
    name: 'David Wilson',
    totalClaims: 75,
    approvedClaims: 65,
    rejectedClaims: 5,
    pendingClaims: 5,
    totalClaimValue: 3750000,
    approvedClaimValue: 3250000,
    successRate: 86.7,
    averageProcessingTime: 40, // days
    clientSatisfactionScore: 4.9,
    monthlyStats: [
      { month: '2023-01', claims: 6, approved: 5, value: 300000 },
      { month: '2023-02', claims: 8, approved: 7, value: 400000 },
      { month: '2023-03', claims: 9, approved: 8, value: 450000 },
      { month: '2023-04', claims: 10, approved: 9, value: 500000 },
      { month: '2023-05', claims: 12, approved: 10, value: 600000 }
    ]
  },
  {
    id: 'cpa2',
    name: 'Emily Brown',
    totalClaims: 60,
    approvedClaims: 48,
    rejectedClaims: 7,
    pendingClaims: 5,
    totalClaimValue: 3000000,
    approvedClaimValue: 2400000,
    successRate: 80,
    averageProcessingTime: 42, // days
    clientSatisfactionScore: 4.7,
    monthlyStats: [
      { month: '2023-01', claims: 5, approved: 4, value: 250000 },
      { month: '2023-02', claims: 6, approved: 5, value: 300000 },
      { month: '2023-03', claims: 7, approved: 6, value: 350000 },
      { month: '2023-04', claims: 8, approved: 6, value: 400000 },
      { month: '2023-05', claims: 9, approved: 7, value: 450000 }
    ]
  }
];

// Mock API methods
const mockApi = {
  // Lead methods
  getLeads: async (): Promise<Lead[]> => {
    return [...mockLeads];
  },
  
  getLeadById: async (id: string): Promise<Lead | null> => {
    const lead = mockLeads.find(lead => lead.id === id);
    return lead ? { ...lead } : null;
  },
  
  createLead: async (data: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Promise<Lead> => {
    const newLead: Lead = {
      ...data,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockLeads.push(newLead);
    return { ...newLead };
  },
  
  updateLead: async (id: string, data: Partial<Lead>): Promise<Lead | null> => {
    const index = mockLeads.findIndex(lead => lead.id === id);
    if (index === -1) return null;
    
    const updatedLead = {
      ...mockLeads[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    mockLeads[index] = updatedLead;
    return { ...updatedLead };
  },
  
  deleteLead: async (id: string): Promise<boolean> => {
    const index = mockLeads.findIndex(lead => lead.id === id);
    if (index === -1) return false;
    
    mockLeads.splice(index, 1);
    return true;
  },
  
  // Document methods
  getDocuments: async (): Promise<Document[]> => {
    return [...mockDocuments];
  },
  
  getDocumentById: async (id: string): Promise<Document | null> => {
    const document = mockDocuments.find(doc => doc.id === id);
    return document ? { ...document } : null;
  },
  
  getDocumentsByLeadId: async (leadId: string): Promise<Document[]> => {
    return mockDocuments.filter(doc => doc.leadId === leadId).map(doc => ({ ...doc }));
  },
  
  uploadDocument: async (data: Omit<Document, 'id'>): Promise<Document> => {
    const newDocument: Document = {
      ...data,
      id: uuidv4()
    };
    mockDocuments.push(newDocument);
    return { ...newDocument };
  },
  
  updateDocument: async (id: string, data: Partial<Document>): Promise<Document | null> => {
    const index = mockDocuments.findIndex(doc => doc.id === id);
    if (index === -1) return null;
    
    const updatedDocument = {
      ...mockDocuments[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    mockDocuments[index] = updatedDocument;
    return { ...updatedDocument };
  },
  
  deleteDocument: async (id: string): Promise<boolean> => {
    const index = mockDocuments.findIndex(doc => doc.id === id);
    if (index === -1) return false;
    
    mockDocuments.splice(index, 1);
    return true;
  },
  
  // Call methods
  getCalls: async (): Promise<Call[]> => {
    return [...mockCalls];
  },
  
  getCallById: async (id: string): Promise<Call | null> => {
    const call = mockCalls.find(call => call.id === id);
    return call ? { ...call } : null;
  },
  
  getCallsByLeadId: async (leadId: string): Promise<Call[]> => {
    return mockCalls.filter(call => call.leadId === leadId).map(call => ({ ...call }));
  },
  
  createCall: async (data: Omit<Call, 'id'>): Promise<Call> => {
    const newCall: Call = {
      ...data,
      id: uuidv4()
    };
    mockCalls.push(newCall);
    return { ...newCall };
  },
  
  updateCall: async (id: string, data: Partial<Call>): Promise<Call | null> => {
    const index = mockCalls.findIndex(call => call.id === id);
    if (index === -1) return null;
    
    const updatedCall = {
      ...mockCalls[index],
      ...data
    };
    mockCalls[index] = updatedCall;
    return { ...updatedCall };
  },
  
  deleteCall: async (id: string): Promise<boolean> => {
    const index = mockCalls.findIndex(call => call.id === id);
    if (index === -1) return false;
    
    mockCalls.splice(index, 1);
    return true;
  },
  
  // Claim methods
  getClaims: async (): Promise<Claim[]> => {
    return [...mockClaims];
  },
  
  getClaimById: async (id: string): Promise<Claim | null> => {
    const claim = mockClaims.find(claim => claim.id === id);
    return claim ? { ...claim } : null;
  },
  
  getClaimsByLeadId: async (leadId: string): Promise<Claim[]> => {
    return mockClaims.filter(claim => claim.leadId === leadId).map(claim => ({ ...claim }));
  },
  
  createClaim: async (data: Omit<Claim, 'id'>): Promise<Claim> => {
    const newClaim: Claim = {
      ...data,
      id: uuidv4(),
      lastUpdated: new Date().toISOString()
    };
    mockClaims.push(newClaim);
    return { ...newClaim };
  },
  
  updateClaim: async (id: string, data: Partial<Claim>): Promise<Claim | null> => {
    const index = mockClaims.findIndex(claim => claim.id === id);
    if (index === -1) return null;
    
    const updatedClaim = {
      ...mockClaims[index],
      ...data,
      lastUpdated: new Date().toISOString()
    };
    mockClaims[index] = updatedClaim;
    return { ...updatedClaim };
  },
  
  deleteClaim: async (id: string): Promise<boolean> => {
    const index = mockClaims.findIndex(claim => claim.id === id);
    if (index === -1) return false;
    
    mockClaims.splice(index, 1);
    return true;
  },
  
  // Timeline methods for claims (not in the type but useful for the mock)
  addClaimTimelineEntry: async (claimId: string, entry: { action: string; description: string; createdBy: string }): Promise<any> => {
    const claim = await mockApi.getClaimById(claimId);
    if (!claim) return null;
    
    // @ts-ignore - we're adding a timeline property that might not be in the type
    if (!claim.timeline) claim.timeline = [];
    
    const timelineEntry = {
      id: uuidv4(),
      claimId,
      eventType: entry.action,
      description: entry.description,
      timestamp: new Date().toISOString(),
      userId: entry.createdBy,
      userName: entry.createdBy === 'agent1' ? 'Alice Johnson' : 'Bob Smith'
    };
    
    // @ts-ignore - timeline property might not exist in the type
    claim.timeline.push(timelineEntry);
    
    // Update the claim in the mock data
    await mockApi.updateClaim(claimId, claim);
    
    return timelineEntry;
  },
  
  // Performance methods
  getFirmPerformance: async (): Promise<typeof mockFirmPerformance> => {
    return { ...mockFirmPerformance };
  },
  
  getCPAPerformance: async (): Promise<typeof mockCPAPerformance> => {
    return [...mockCPAPerformance];
  },
  
  getCPAPerformanceById: async (id: string): Promise<typeof mockCPAPerformance[0] | null> => {
    const cpaPerformance = mockCPAPerformance.find(cpa => cpa.id === id);
    return cpaPerformance ? { ...cpaPerformance } : null;
  }
};

export default mockApi; 