import { z } from 'zod';

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
}

// Call schema for validation
export const callSchema = z.object({
  id: z.string().uuid(),
  leadId: z.string().uuid(),
  agentId: z.string().uuid(),
  direction: z.nativeEnum(CallDirection),
  outcome: z.nativeEnum(CallOutcome),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  duration: z.number().min(0), // in seconds
  recordingUrl: z.string().url().optional(),
  recordingS3Key: z.string().optional(),
  notes: z.string().max(2000).optional(),
  tags: z.array(z.string()).optional(),
  connectContactId: z.string().optional(),
  queueName: z.string().optional(),
  transferredFrom: z.string().uuid().optional(),
  transferredTo: z.string().uuid().optional(),
});

// Call type
export type Call = z.infer<typeof callSchema>;

// Call creation input schema
export const createCallSchema = z.object({
  leadId: z.string().uuid(),
  agentId: z.string().uuid(),
  direction: z.nativeEnum(CallDirection),
  outcome: z.nativeEnum(CallOutcome),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  duration: z.number().min(0),
  recordingUrl: z.string().url().optional(),
  recordingS3Key: z.string().optional(),
  notes: z.string().max(2000).optional(),
  tags: z.array(z.string()).optional(),
  connectContactId: z.string().optional(),
  queueName: z.string().optional(),
  transferredFrom: z.string().uuid().optional(),
  transferredTo: z.string().uuid().optional(),
});

// Call update input schema
export const updateCallSchema = z.object({
  notes: z.string().max(2000).optional(),
  tags: z.array(z.string()).optional(),
});

// Call query parameters schema
export const callQuerySchema = z.object({
  leadId: z.string().uuid().optional(),
  agentId: z.string().uuid().optional(),
  direction: z.nativeEnum(CallDirection).optional(),
  outcome: z.nativeEnum(CallOutcome).optional(),
  fromDate: z.string().datetime().optional(),
  toDate: z.string().datetime().optional(),
  minDuration: z.number().min(0).optional(),
  maxDuration: z.number().min(0).optional(),
  hasRecording: z.boolean().optional(),
  limit: z.number().min(1).max(100).default(20),
  nextToken: z.string().optional(),
});

export type CallQuery = z.infer<typeof callQuerySchema>; 