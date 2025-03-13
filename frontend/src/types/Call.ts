// Call direction enum
export enum CallDirection {
  INBOUND = 'INBOUND',
  OUTBOUND = 'OUTBOUND',
}

// Call outcome enum
export enum CallOutcome {
  ANSWERED = 'ANSWERED',
  VOICEMAIL = 'VOICEMAIL',
  NO_ANSWER = 'NO_ANSWER',
  BUSY = 'BUSY',
  FAILED = 'FAILED',
  // Additional outcomes to match mock data
  SCHEDULED_FOLLOW_UP = 'SCHEDULED_FOLLOW_UP',
  REQUESTED_INFORMATION = 'REQUESTED_INFORMATION',
  LEFT_VOICEMAIL = 'LEFT_VOICEMAIL',
}

// Call interface
export interface Call {
  id: string;
  leadId: string;
  agentId: string;
  direction: CallDirection;
  outcome: CallOutcome;
  startTime: string;
  endTime: string;
  duration: number; // in seconds
  recordingUrl?: string;
  recordingS3Key?: string;
  notes?: string;
  tags?: string[];
  connectContactId?: string;
  queueName?: string;
  transferredFrom?: string;
  transferredTo?: string;
}

// Call creation input interface
export interface CreateCallInput {
  leadId: string;
  agentId: string;
  direction: CallDirection;
  outcome: CallOutcome;
  startTime: string;
  endTime: string;
  duration: number;
  recordingUrl?: string;
  recordingS3Key?: string;
  notes?: string;
  tags?: string[];
  connectContactId?: string;
  queueName?: string;
  transferredFrom?: string;
  transferredTo?: string;
}

// Call update input interface
export interface UpdateCallInput {
  notes?: string;
  tags?: string[];
}

// Call query parameters interface
export interface CallQueryParams {
  leadId?: string;
  agentId?: string;
  direction?: CallDirection;
  outcome?: CallOutcome;
  fromDate?: string;
  toDate?: string;
  minDuration?: number;
  maxDuration?: number;
  hasRecording?: boolean;
  limit?: number;
  offset?: number;
}

// Call list response interface
export interface CallListResponse {
  calls: Call[];
  total: number;
  limit: number;
  offset: number;
}

// Recording URL response interface
export interface RecordingUrlResponse {
  recordingUrl: string;
} 