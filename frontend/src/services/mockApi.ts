import { Lead, LeadStatus } from '../types/Lead';
import { Document, DocumentType } from '../types/Document';
import { Call, CallDirection, CallOutcome } from '../types/Call';
import { Claim, ClaimStatus, ClaimType, ClaimPriority } from '../types/Claim';
import { v4 as uuidv4 } from 'uuid';

// Mock data
const mockLeads: Lead[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '555-123-4567',
    status: LeadStatus.NEW,
    source: 'Website',
    notes: 'Interested in filing a claim',
    createdAt: new Date('2023-01-15').toISOString(),
    updatedAt: new Date('2023-01-15').toISOString(),
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phone: '555-987-6543',
    status: LeadStatus.CONTACTED,
    source: 'Referral',
    notes: 'Follow up next week',
    createdAt: new Date('2023-02-10').toISOString(),
    updatedAt: new Date('2023-02-12').toISOString(),
  },
  {
    id: '3',
    firstName: 'Robert',
    lastName: 'Johnson',
    email: 'robert.johnson@example.com',
    phone: '555-456-7890',
    status: LeadStatus.QUALIFIED,
    source: 'Google',
    notes: 'Ready to proceed with claim',
    createdAt: new Date('2023-03-05').toISOString(),
    updatedAt: new Date('2023-03-07').toISOString(),
  },
];

const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'Insurance Policy',
    type: DocumentType.POLICY,
    fileUrl: 'https://example.com/documents/policy1.pdf',
    uploadedBy: 'John Admin',
    claimId: '1',
    createdAt: new Date('2023-01-20').toISOString(),
  },
  {
    id: '2',
    name: 'Damage Photos',
    type: DocumentType.PHOTO,
    fileUrl: 'https://example.com/documents/photos1.zip',
    uploadedBy: 'Jane Agent',
    claimId: '1',
    createdAt: new Date('2023-01-22').toISOString(),
  },
  {
    id: '3',
    name: 'Medical Report',
    type: DocumentType.MEDICAL,
    fileUrl: 'https://example.com/documents/medical1.pdf',
    uploadedBy: 'Robert Doctor',
    claimId: '2',
    createdAt: new Date('2023-02-15').toISOString(),
  },
];

const mockCalls: Call[] = [
  {
    id: '1',
    leadId: '1',
    agentId: 'agent1',
    direction: CallDirection.OUTBOUND,
    outcome: CallOutcome.ANSWERED,
    startTime: new Date('2023-01-16T10:00:00Z').toISOString(),
    endTime: new Date('2023-01-16T10:05:00Z').toISOString(),
    duration: 300, // 5 minutes
    notes: 'Discussed claim details',
    tags: ['follow-up', 'claim-discussion'],
  },
  {
    id: '2',
    leadId: '2',
    agentId: 'agent2',
    direction: CallDirection.OUTBOUND,
    outcome: CallOutcome.VOICEMAIL,
    startTime: new Date('2023-02-20T14:30:00Z').toISOString(),
    endTime: new Date('2023-02-20T14:31:00Z').toISOString(),
    duration: 60,
    notes: 'Need to discuss policy options',
    tags: ['initial-contact'],
  },
  {
    id: '3',
    leadId: '1',
    agentId: 'agent1',
    direction: CallDirection.INBOUND,
    outcome: CallOutcome.ANSWERED,
    startTime: new Date('2023-01-23T11:00:00Z').toISOString(),
    endTime: new Date('2023-01-23T11:08:00Z').toISOString(),
    duration: 480, // 8 minutes
    notes: 'Follow-up on documentation',
    tags: ['documentation', 'follow-up'],
  },
];

const mockClaims: Claim[] = [
  {
    id: '1',
    leadId: '1',
    type: ClaimType.AUTO,
    status: ClaimStatus.IN_PROGRESS,
    priority: ClaimPriority.MEDIUM,
    description: 'Car accident on Highway 101',
    amount: 15000,
    assignedTo: 'agent1',
    policyNumber: 'POL-123456',
    incidentDate: new Date('2023-01-10').toISOString(),
    createdAt: new Date('2023-01-15').toISOString(),
    updatedAt: new Date('2023-01-18').toISOString(),
    timeline: [
      {
        id: '1',
        claimId: '1',
        action: 'Claim Created',
        description: 'Claim was created in the system',
        createdAt: new Date('2023-01-15').toISOString(),
        createdBy: 'John Admin',
      },
      {
        id: '2',
        claimId: '1',
        action: 'Documents Requested',
        description: 'Requested insurance policy and photos',
        createdAt: new Date('2023-01-16').toISOString(),
        createdBy: 'Jane Agent',
      },
    ],
  },
  {
    id: '2',
    leadId: '2',
    type: ClaimType.HEALTH,
    status: ClaimStatus.NEW,
    priority: ClaimPriority.HIGH,
    description: 'Medical procedure coverage',
    amount: 8500,
    assignedTo: 'agent2',
    policyNumber: 'POL-789012',
    incidentDate: new Date('2023-02-05').toISOString(),
    createdAt: new Date('2023-02-10').toISOString(),
    updatedAt: new Date('2023-02-10').toISOString(),
    timeline: [
      {
        id: '3',
        claimId: '2',
        action: 'Claim Created',
        description: 'Claim was created in the system',
        createdAt: new Date('2023-02-10').toISOString(),
        createdBy: 'Jane Agent',
      },
    ],
  },
  {
    id: '3',
    leadId: '3',
    type: ClaimType.PROPERTY,
    status: ClaimStatus.APPROVED,
    priority: ClaimPriority.LOW,
    description: 'Water damage from pipe leak',
    amount: 5200,
    assignedTo: 'agent3',
    policyNumber: 'POL-345678',
    incidentDate: new Date('2023-03-01').toISOString(),
    createdAt: new Date('2023-03-05').toISOString(),
    updatedAt: new Date('2023-03-15').toISOString(),
    timeline: [
      {
        id: '4',
        claimId: '3',
        action: 'Claim Created',
        description: 'Claim was created in the system',
        createdAt: new Date('2023-03-05').toISOString(),
        createdBy: 'Robert Agent',
      },
      {
        id: '5',
        claimId: '3',
        action: 'Inspection Scheduled',
        description: 'Property inspection scheduled for March 10',
        createdAt: new Date('2023-03-07').toISOString(),
        createdBy: 'Robert Agent',
      },
      {
        id: '6',
        claimId: '3',
        action: 'Claim Approved',
        description: 'Claim approved for full amount',
        createdAt: new Date('2023-03-15').toISOString(),
        createdBy: 'Manager',
      },
    ],
  },
];

// Mock firm performance data
const mockFirmPerformance = {
  totalClaims: 125,
  approvedClaims: 87,
  deniedClaims: 23,
  pendingClaims: 15,
  totalRevenue: 1250000,
  averageClaimAmount: 14367,
  successRate: 0.7,
  monthlyStats: [
    { month: 'Jan', claims: 12, revenue: 120000 },
    { month: 'Feb', claims: 15, revenue: 145000 },
    { month: 'Mar', claims: 18, revenue: 180000 },
    { month: 'Apr', claims: 14, revenue: 135000 },
    { month: 'May', claims: 16, revenue: 155000 },
    { month: 'Jun', claims: 20, revenue: 195000 },
    { month: 'Jul', claims: 17, revenue: 165000 },
    { month: 'Aug', claims: 13, revenue: 125000 },
    { month: 'Sep', claims: 15, revenue: 145000 },
    { month: 'Oct', claims: 19, revenue: 185000 },
    { month: 'Nov', claims: 22, revenue: 215000 },
    { month: 'Dec', claims: 18, revenue: 175000 },
  ],
};

// Mock CPA performance data
const mockCPAPerformance = [
  {
    id: '1',
    name: 'John Smith',
    totalClaims: 45,
    approvedClaims: 32,
    deniedClaims: 8,
    pendingClaims: 5,
    totalRevenue: 450000,
    successRate: 0.71,
    averageClaimAmount: 14062.5,
    monthlyStats: [
      { month: 'Jan', claims: 4, revenue: 40000 },
      { month: 'Feb', claims: 5, revenue: 48000 },
      { month: 'Mar', claims: 6, revenue: 60000 },
      { month: 'Apr', claims: 4, revenue: 38000 },
      { month: 'May', claims: 5, revenue: 50000 },
      { month: 'Jun', claims: 7, revenue: 68000 },
      { month: 'Jul', claims: 6, revenue: 58000 },
      { month: 'Aug', claims: 4, revenue: 42000 },
      { month: 'Sep', claims: 5, revenue: 48000 },
      { month: 'Oct', claims: 6, revenue: 62000 },
      { month: 'Nov', claims: 8, revenue: 78000 },
      { month: 'Dec', claims: 6, revenue: 60000 },
    ],
  },
  {
    id: '2',
    name: 'Jane Doe',
    totalClaims: 38,
    approvedClaims: 29,
    deniedClaims: 6,
    pendingClaims: 3,
    totalRevenue: 380000,
    successRate: 0.76,
    averageClaimAmount: 13103.45,
    monthlyStats: [
      { month: 'Jan', claims: 3, revenue: 32000 },
      { month: 'Feb', claims: 4, revenue: 38000 },
      { month: 'Mar', claims: 5, revenue: 48000 },
      { month: 'Apr', claims: 4, revenue: 40000 },
      { month: 'May', claims: 4, revenue: 42000 },
      { month: 'Jun', claims: 6, revenue: 58000 },
      { month: 'Jul', claims: 5, revenue: 50000 },
      { month: 'Aug', claims: 3, revenue: 32000 },
      { month: 'Sep', claims: 4, revenue: 40000 },
      { month: 'Oct', claims: 5, revenue: 52000 },
      { month: 'Nov', claims: 6, revenue: 60000 },
      { month: 'Dec', claims: 5, revenue: 48000 },
    ],
  },
  {
    id: '3',
    name: 'Robert Johnson',
    totalClaims: 42,
    approvedClaims: 26,
    deniedClaims: 9,
    pendingClaims: 7,
    totalRevenue: 420000,
    successRate: 0.62,
    averageClaimAmount: 16153.85,
    monthlyStats: [
      { month: 'Jan', claims: 5, revenue: 48000 },
      { month: 'Feb', claims: 6, revenue: 59000 },
      { month: 'Mar', claims: 7, revenue: 72000 },
      { month: 'Apr', claims: 6, revenue: 57000 },
      { month: 'May', claims: 7, revenue: 63000 },
      { month: 'Jun', claims: 7, revenue: 69000 },
      { month: 'Jul', claims: 6, revenue: 57000 },
      { month: 'Aug', claims: 6, revenue: 51000 },
      { month: 'Sep', claims: 6, revenue: 57000 },
      { month: 'Oct', claims: 8, revenue: 71000 },
      { month: 'Nov', claims: 8, revenue: 77000 },
      { month: 'Dec', claims: 7, revenue: 67000 },
    ],
  },
];

// Mock API methods
export const mockApi = {
  // Lead methods
  getLeads: async (): Promise<Lead[]> => {
    return [...mockLeads];
  },
  
  getLeadById: async (id: string): Promise<Lead | null> => {
    const lead = mockLeads.find(lead => lead.id === id);
    return lead ? { ...lead } : null;
  },
  
  createLead: async (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Promise<Lead> => {
    const newLead: Lead = {
      ...lead,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockLeads.push(newLead);
    return { ...newLead };
  },
  
  updateLead: async (id: string, lead: Partial<Lead>): Promise<Lead | null> => {
    const index = mockLeads.findIndex(l => l.id === id);
    if (index === -1) return null;
    
    mockLeads[index] = {
      ...mockLeads[index],
      ...lead,
      updatedAt: new Date().toISOString(),
    };
    
    return { ...mockLeads[index] };
  },
  
  deleteLead: async (id: string): Promise<boolean> => {
    const index = mockLeads.findIndex(l => l.id === id);
    if (index === -1) return false;
    
    mockLeads.splice(index, 1);
    return true;
  },
  
  // Document methods
  getDocuments: async (): Promise<Document[]> => {
    return [...mockDocuments];
  },
  
  getDocumentsByClaimId: async (claimId: string): Promise<Document[]> => {
    return mockDocuments.filter(doc => doc.claimId === claimId).map(doc => ({ ...doc }));
  },
  
  uploadDocument: async (document: Omit<Document, 'id' | 'createdAt'>): Promise<Document> => {
    const newDocument: Document = {
      ...document,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    mockDocuments.push(newDocument);
    return { ...newDocument };
  },
  
  deleteDocument: async (id: string): Promise<boolean> => {
    const index = mockDocuments.findIndex(d => d.id === id);
    if (index === -1) return false;
    
    mockDocuments.splice(index, 1);
    return true;
  },
  
  // Call methods
  getCalls: async (): Promise<Call[]> => {
    return [...mockCalls];
  },
  
  getCallsByLeadId: async (leadId: string): Promise<Call[]> => {
    return mockCalls.filter(call => call.leadId === leadId).map(call => ({ ...call }));
  },
  
  createCall: async (call: Omit<Call, 'id'>): Promise<Call> => {
    const newCall: Call = {
      ...call,
      id: uuidv4(),
    };
    mockCalls.push(newCall);
    return { ...newCall };
  },
  
  updateCall: async (id: string, call: Partial<Call>): Promise<Call | null> => {
    const index = mockCalls.findIndex(c => c.id === id);
    if (index === -1) return null;
    
    mockCalls[index] = {
      ...mockCalls[index],
      ...call,
    };
    
    return { ...mockCalls[index] };
  },
  
  deleteCall: async (id: string): Promise<boolean> => {
    const index = mockCalls.findIndex(c => c.id === id);
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
  
  createClaim: async (claim: Omit<Claim, 'id' | 'createdAt' | 'updatedAt' | 'timeline'>): Promise<Claim> => {
    const newClaim: Claim = {
      ...claim,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timeline: [
        {
          id: uuidv4(),
          claimId: '',  // Will be updated after ID is assigned
          action: 'Claim Created',
          description: 'Claim was created in the system',
          createdAt: new Date().toISOString(),
          createdBy: 'System',
        }
      ],
    };
    
    // Update the claimId in the timeline
    newClaim.timeline[0].claimId = newClaim.id;
    
    mockClaims.push(newClaim);
    return { ...newClaim };
  },
  
  updateClaim: async (id: string, claim: Partial<Claim>): Promise<Claim | null> => {
    const index = mockClaims.findIndex(c => c.id === id);
    if (index === -1) return null;
    
    // Create a timeline entry for the update if not provided
    if (!claim.timeline && mockClaims[index].status !== claim.status && claim.status) {
      const timelineEntry = {
        id: uuidv4(),
        claimId: id,
        action: `Status Changed to ${claim.status}`,
        description: `Claim status was updated to ${claim.status}`,
        createdAt: new Date().toISOString(),
        createdBy: 'System',
      };
      
      mockClaims[index] = {
        ...mockClaims[index],
        ...claim,
        updatedAt: new Date().toISOString(),
        timeline: [...mockClaims[index].timeline, timelineEntry],
      };
    } else {
      mockClaims[index] = {
        ...mockClaims[index],
        ...claim,
        updatedAt: new Date().toISOString(),
      };
    }
    
    return { ...mockClaims[index] };
  },
  
  addClaimTimelineEntry: async (claimId: string, entry: Omit<Claim['timeline'][0], 'id' | 'claimId' | 'createdAt'>): Promise<Claim | null> => {
    const index = mockClaims.findIndex(c => c.id === claimId);
    if (index === -1) return null;
    
    const timelineEntry = {
      id: uuidv4(),
      claimId,
      ...entry,
      createdAt: new Date().toISOString(),
    };
    
    mockClaims[index].timeline.push(timelineEntry);
    mockClaims[index].updatedAt = new Date().toISOString();
    
    return { ...mockClaims[index] };
  },
  
  deleteClaim: async (id: string): Promise<boolean> => {
    const index = mockClaims.findIndex(c => c.id === id);
    if (index === -1) return false;
    
    mockClaims.splice(index, 1);
    return true;
  },
  
  // Firm performance methods
  getFirmPerformance: async () => {
    return { ...mockFirmPerformance };
  },
  
  // CPA performance methods
  getCPAPerformance: async () => {
    return [...mockCPAPerformance];
  },
  
  getCPAPerformanceById: async (id: string) => {
    const cpa = mockCPAPerformance.find(cpa => cpa.id === id);
    return cpa ? { ...cpa } : null;
  },
};

export default mockApi; 