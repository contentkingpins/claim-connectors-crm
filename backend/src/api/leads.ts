import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { 
  Lead, 
  createLeadSchema, 
  updateLeadSchema, 
  leadQuerySchema,
  LeadStatus,
  LeadSource
} from '../models/Lead';
import { 
  getItem, 
  putItem, 
  updateItem, 
  deleteItem, 
  scanItems,
  LEADS_TABLE 
} from '../services/dynamoDbService';

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

// Create a new lead
export const create = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    // Parse request body
    const requestBody = JSON.parse(event.body || '{}');
    
    // Validate input
    const validationResult = createLeadSchema.safeParse(requestBody);
    if (!validationResult.success) {
      return formatResponse(400, { 
        message: 'Invalid input', 
        errors: validationResult.error.errors 
      });
    }
    
    // Create lead object
    const now = new Date().toISOString();
    const lead: Lead = {
      ...validationResult.data,
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
    };
    
    // Save to DynamoDB
    await putItem<Lead>(LEADS_TABLE, lead);
    
    return formatResponse(201, lead);
  } catch (error) {
    console.error('Error creating lead:', error);
    return formatResponse(500, { message: 'Internal server error' });
  }
};

// Get a lead by ID
export const get = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    // Get lead ID from path parameters
    const leadId = event.pathParameters?.id;
    if (!leadId) {
      return formatResponse(400, { message: 'Lead ID is required' });
    }
    
    // Get lead from DynamoDB
    const lead = await getItem<Lead>(LEADS_TABLE, leadId);
    if (!lead) {
      return formatResponse(404, { message: 'Lead not found' });
    }
    
    return formatResponse(200, lead);
  } catch (error) {
    console.error('Error getting lead:', error);
    return formatResponse(500, { message: 'Internal server error' });
  }
};

// Update a lead
export const update = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    // Get lead ID from path parameters
    const leadId = event.pathParameters?.id;
    if (!leadId) {
      return formatResponse(400, { message: 'Lead ID is required' });
    }
    
    // Parse request body
    const requestBody = JSON.parse(event.body || '{}');
    
    // Validate input
    const validationResult = updateLeadSchema.safeParse(requestBody);
    if (!validationResult.success) {
      return formatResponse(400, { 
        message: 'Invalid input', 
        errors: validationResult.error.errors 
      });
    }
    
    // Check if lead exists
    const existingLead = await getItem<Lead>(LEADS_TABLE, leadId);
    if (!existingLead) {
      return formatResponse(404, { message: 'Lead not found' });
    }
    
    // Update lead
    const updatedLead = await updateItem<Lead>(
      LEADS_TABLE,
      leadId,
      validationResult.data
    );
    
    return formatResponse(200, updatedLead);
  } catch (error) {
    console.error('Error updating lead:', error);
    return formatResponse(500, { message: 'Internal server error' });
  }
};

// Delete a lead
export const deleteLead = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    // Get lead ID from path parameters
    const leadId = event.pathParameters?.id;
    if (!leadId) {
      return formatResponse(400, { message: 'Lead ID is required' });
    }
    
    // Check if lead exists
    const existingLead = await getItem<Lead>(LEADS_TABLE, leadId);
    if (!existingLead) {
      return formatResponse(404, { message: 'Lead not found' });
    }
    
    // Delete lead
    await deleteItem(LEADS_TABLE, leadId);
    
    return formatResponse(204, null);
  } catch (error) {
    console.error('Error deleting lead:', error);
    return formatResponse(500, { message: 'Internal server error' });
  }
};

// List leads with filtering and pagination
export const list = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    // Parse query parameters
    const queryParams = event.queryStringParameters || {};
    
    // Validate query parameters
    const validationResult = leadQuerySchema.safeParse(queryParams);
    if (!validationResult.success) {
      return formatResponse(400, { 
        message: 'Invalid query parameters', 
        errors: validationResult.error.errors 
      });
    }
    
    const { 
      status, 
      source, 
      assignedTo, 
      fromDate, 
      toDate, 
      searchTerm,
      limit = 20,
      nextToken 
    } = validationResult.data;
    
    // Build filter expression for scan
    let filterExpressions: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};
    
    // Add status filter
    if (status) {
      filterExpressions.push('#status = :status');
      expressionAttributeNames['#status'] = 'status';
      expressionAttributeValues[':status'] = status;
    }
    
    // Add source filter
    if (source) {
      filterExpressions.push('#source = :source');
      expressionAttributeNames['#source'] = 'source';
      expressionAttributeValues[':source'] = source;
    }
    
    // Add assignedTo filter
    if (assignedTo) {
      filterExpressions.push('#assignedTo = :assignedTo');
      expressionAttributeNames['#assignedTo'] = 'assignedTo';
      expressionAttributeValues[':assignedTo'] = assignedTo;
    }
    
    // Add date range filter
    if (fromDate && toDate) {
      filterExpressions.push('#createdAt BETWEEN :fromDate AND :toDate');
      expressionAttributeNames['#createdAt'] = 'createdAt';
      expressionAttributeValues[':fromDate'] = fromDate;
      expressionAttributeValues[':toDate'] = toDate;
    } else if (fromDate) {
      filterExpressions.push('#createdAt >= :fromDate');
      expressionAttributeNames['#createdAt'] = 'createdAt';
      expressionAttributeValues[':fromDate'] = fromDate;
    } else if (toDate) {
      filterExpressions.push('#createdAt <= :toDate');
      expressionAttributeNames['#createdAt'] = 'createdAt';
      expressionAttributeValues[':toDate'] = toDate;
    }
    
    // Add search term filter (search in firstName, lastName, email, company)
    if (searchTerm) {
      const searchFilters = [
        'contains(#firstName, :searchTerm)',
        'contains(#lastName, :searchTerm)',
        'contains(#email, :searchTerm)',
        'contains(#company, :searchTerm)'
      ];
      filterExpressions.push(`(${searchFilters.join(' OR ')})`);
      expressionAttributeNames['#firstName'] = 'firstName';
      expressionAttributeNames['#lastName'] = 'lastName';
      expressionAttributeNames['#email'] = 'email';
      expressionAttributeNames['#company'] = 'company';
      expressionAttributeValues[':searchTerm'] = searchTerm;
    }
    
    // Combine filter expressions
    const filterExpression = filterExpressions.length > 0 
      ? filterExpressions.join(' AND ') 
      : undefined;
    
    // Parse next token if provided
    let exclusiveStartKey;
    if (nextToken) {
      try {
        exclusiveStartKey = JSON.parse(Buffer.from(nextToken, 'base64').toString());
      } catch (error) {
        return formatResponse(400, { message: 'Invalid pagination token' });
      }
    }
    
    // Scan DynamoDB for leads
    const { items: leads, lastEvaluatedKey } = await scanItems<Lead>(
      LEADS_TABLE,
      filterExpression,
      Object.keys(expressionAttributeNames).length > 0 ? expressionAttributeNames : undefined,
      Object.keys(expressionAttributeValues).length > 0 ? expressionAttributeValues : undefined,
      Number(limit),
      exclusiveStartKey
    );
    
    // Generate next token for pagination
    const newNextToken = lastEvaluatedKey 
      ? Buffer.from(JSON.stringify(lastEvaluatedKey)).toString('base64') 
      : undefined;
    
    return formatResponse(200, {
      leads,
      nextToken: newNextToken,
      count: leads.length,
    });
  } catch (error) {
    console.error('Error listing leads:', error);
    return formatResponse(500, { message: 'Internal server error' });
  }
};

// Export the delete function with the correct name for Lambda
export { deleteLead as delete }; 