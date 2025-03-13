import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuid } from 'uuid';
import { 
  Call, 
  createCallSchema, 
  updateCallSchema, 
  callQuerySchema 
} from '../models/Call';
import { 
  getItem, 
  putItem, 
  updateItem, 
  queryItems, 
  CALLS_TABLE 
} from '../services/dynamoDbService';
import { getRecordingUrl as s3GetRecordingUrl } from '../services/s3Service';

// Helper function to format response
const formatResponse = (statusCode: number, body: any): APIGatewayProxyResult => {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(body),
  };
};

// Save call metadata
export const saveMetadata = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    // Parse request body
    const requestBody = JSON.parse(event.body || '{}');
    
    // Validate input
    const validationResult = createCallSchema.safeParse(requestBody);
    if (!validationResult.success) {
      return formatResponse(400, { 
        message: 'Invalid input', 
        errors: validationResult.error.errors 
      });
    }
    
    // Create call object
    const callId = uuid();
    const call: Call = {
      ...validationResult.data,
      id: callId,
    };
    
    // Save to DynamoDB
    await putItem<Call>(CALLS_TABLE, call);
    
    return formatResponse(201, call);
  } catch (error) {
    console.error('Error saving call metadata:', error);
    return formatResponse(500, { message: 'Internal server error' });
  }
};

// Get call recording URL
export const getRecordingUrl = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    // Get call ID from path parameters
    const callId = event.pathParameters?.id;
    if (!callId) {
      return formatResponse(400, { message: 'Call ID is required' });
    }
    
    // Get call metadata from DynamoDB
    const call = await getItem<Call>(CALLS_TABLE, callId);
    if (!call) {
      return formatResponse(404, { message: 'Call not found' });
    }
    
    // Check if call has a recording
    if (!call.recordingS3Key) {
      return formatResponse(404, { message: 'Call has no recording' });
    }
    
    // Get user ID from the request context (from Cognito)
    const userId = event.requestContext.authorizer?.claims?.sub || 'unknown-user';
    
    // Check if user has access to the call recording
    // In a real application, you would check if they are the agent
    if (call.agentId !== userId) {
      return formatResponse(403, { message: 'Access denied' });
    }
    
    // Generate pre-signed URL for the recording
    const recordingUrl = await s3GetRecordingUrl(call.recordingS3Key);
    
    return formatResponse(200, {
      callId,
      recordingUrl,
      call,
    });
  } catch (error) {
    console.error('Error getting recording URL:', error);
    return formatResponse(500, { message: 'Internal server error' });
  }
};

// Update call notes
export const updateNotes = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    // Get call ID from path parameters
    const callId = event.pathParameters?.id;
    if (!callId) {
      return formatResponse(400, { message: 'Call ID is required' });
    }
    
    // Parse request body
    const requestBody = JSON.parse(event.body || '{}');
    
    // Validate input
    const validationResult = updateCallSchema.safeParse(requestBody);
    if (!validationResult.success) {
      return formatResponse(400, { 
        message: 'Invalid input', 
        errors: validationResult.error.errors 
      });
    }
    
    // Get call metadata from DynamoDB
    const call = await getItem<Call>(CALLS_TABLE, callId);
    if (!call) {
      return formatResponse(404, { message: 'Call not found' });
    }
    
    // Get user ID from the request context (from Cognito)
    const userId = event.requestContext.authorizer?.claims?.sub || 'unknown-user';
    
    // Check if user has access to update the call
    if (call.agentId !== userId) {
      return formatResponse(403, { message: 'Access denied' });
    }
    
    // Update call metadata
    const updatedCall = await updateItem<Call>(
      CALLS_TABLE,
      callId,
      validationResult.data
    );
    
    return formatResponse(200, updatedCall);
  } catch (error) {
    console.error('Error updating call notes:', error);
    return formatResponse(500, { message: 'Internal server error' });
  }
};

// List calls with filtering and pagination
export const list = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    // Parse query parameters
    const queryParams = event.queryStringParameters || {};
    
    // Validate query parameters
    const validationResult = callQuerySchema.safeParse(queryParams);
    if (!validationResult.success) {
      return formatResponse(400, { 
        message: 'Invalid query parameters', 
        errors: validationResult.error.errors 
      });
    }
    
    const { 
      leadId, 
      agentId, 
      direction, 
      outcome, 
      fromDate, 
      toDate, 
      minDuration,
      maxDuration,
      hasRecording,
      limit = 20,
      nextToken 
    } = validationResult.data;
    
    // Parse next token if provided
    let exclusiveStartKey;
    if (nextToken) {
      try {
        exclusiveStartKey = JSON.parse(Buffer.from(nextToken, 'base64').toString());
      } catch (error) {
        return formatResponse(400, { message: 'Invalid pagination token' });
      }
    }
    
    // If leadId is provided, query by leadId using the GSI
    if (leadId) {
      const { items: calls, lastEvaluatedKey } = await queryItems<Call>(
        CALLS_TABLE,
        'LeadIdIndex',
        '#leadId = :leadId',
        { '#leadId': 'leadId' },
        { ':leadId': leadId },
        Number(limit),
        exclusiveStartKey
      );
      
      // Generate next token for pagination
      const newNextToken = lastEvaluatedKey 
        ? Buffer.from(JSON.stringify(lastEvaluatedKey)).toString('base64') 
        : undefined;
      
      return formatResponse(200, {
        calls,
        nextToken: newNextToken,
        count: calls.length,
      });
    }
    
    // Otherwise, build filter expressions for a scan
    let filterExpressions: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};
    
    // Add agentId filter
    if (agentId) {
      filterExpressions.push('#agentId = :agentId');
      expressionAttributeNames['#agentId'] = 'agentId';
      expressionAttributeValues[':agentId'] = agentId;
    }
    
    // Add direction filter
    if (direction) {
      filterExpressions.push('#direction = :direction');
      expressionAttributeNames['#direction'] = 'direction';
      expressionAttributeValues[':direction'] = direction;
    }
    
    // Add outcome filter
    if (outcome) {
      filterExpressions.push('#outcome = :outcome');
      expressionAttributeNames['#outcome'] = 'outcome';
      expressionAttributeValues[':outcome'] = outcome;
    }
    
    // Add date range filter
    if (fromDate && toDate) {
      filterExpressions.push('#startTime BETWEEN :fromDate AND :toDate');
      expressionAttributeNames['#startTime'] = 'startTime';
      expressionAttributeValues[':fromDate'] = fromDate;
      expressionAttributeValues[':toDate'] = toDate;
    } else if (fromDate) {
      filterExpressions.push('#startTime >= :fromDate');
      expressionAttributeNames['#startTime'] = 'startTime';
      expressionAttributeValues[':fromDate'] = fromDate;
    } else if (toDate) {
      filterExpressions.push('#startTime <= :toDate');
      expressionAttributeNames['#startTime'] = 'startTime';
      expressionAttributeValues[':toDate'] = toDate;
    }
    
    // Add duration range filter
    if (minDuration !== undefined && maxDuration !== undefined) {
      filterExpressions.push('#duration BETWEEN :minDuration AND :maxDuration');
      expressionAttributeNames['#duration'] = 'duration';
      expressionAttributeValues[':minDuration'] = minDuration;
      expressionAttributeValues[':maxDuration'] = maxDuration;
    } else if (minDuration !== undefined) {
      filterExpressions.push('#duration >= :minDuration');
      expressionAttributeNames['#duration'] = 'duration';
      expressionAttributeValues[':minDuration'] = minDuration;
    } else if (maxDuration !== undefined) {
      filterExpressions.push('#duration <= :maxDuration');
      expressionAttributeNames['#duration'] = 'duration';
      expressionAttributeValues[':maxDuration'] = maxDuration;
    }
    
    // Add hasRecording filter
    if (hasRecording !== undefined) {
      if (hasRecording) {
        filterExpressions.push('attribute_exists(#recordingS3Key)');
        expressionAttributeNames['#recordingS3Key'] = 'recordingS3Key';
      } else {
        filterExpressions.push('attribute_not_exists(#recordingS3Key)');
        expressionAttributeNames['#recordingS3Key'] = 'recordingS3Key';
      }
    }
    
    // Get user ID from the request context (from Cognito)
    const userId = event.requestContext.authorizer?.claims?.sub || 'unknown-user';
    
    // Add filter to only show calls the user has access to
    // In a real application, you would check if the user has access to the lead
    // For simplicity, we're just checking if they are the agent
    filterExpressions.push('#agentId = :userId');
    expressionAttributeNames['#agentId'] = 'agentId';
    expressionAttributeValues[':userId'] = userId;
    
    // Combine filter expressions
    const filterExpression = filterExpressions.join(' AND ');
    
    // Query DynamoDB for calls
    const { items: calls, lastEvaluatedKey } = await queryItems<Call>(
      CALLS_TABLE,
      undefined,
      filterExpression,
      expressionAttributeNames,
      expressionAttributeValues,
      Number(limit),
      exclusiveStartKey
    );
    
    // Generate next token for pagination
    const newNextToken = lastEvaluatedKey 
      ? Buffer.from(JSON.stringify(lastEvaluatedKey)).toString('base64') 
      : undefined;
    
    return formatResponse(200, {
      calls,
      nextToken: newNextToken,
      count: calls.length,
    });
  } catch (error) {
    console.error('Error listing calls:', error);
    return formatResponse(500, { message: 'Internal server error' });
  }
}; 