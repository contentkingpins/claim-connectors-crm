import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { 
  Document, 
  uploadUrlRequestSchema,
  updateDocumentSchema,
  documentQuerySchema
} from '../models/Document';
import { 
  getItem, 
  putItem, 
  updateItem, 
  deleteItem, 
  queryItems,
  DOCUMENTS_TABLE 
} from '../services/dynamoDbService';
import { 
  getUploadUrl as s3GetUploadUrl, 
  getDownloadUrl as s3GetDownloadUrl, 
  deleteObject,
  DOCUMENTS_BUCKET 
} from '../services/s3Service';

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

// Generate a pre-signed URL for uploading a document
export const getUploadUrl = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    // Parse request body
    const requestBody = JSON.parse(event.body || '{}');
    
    // Validate input
    const validationResult = uploadUrlRequestSchema.safeParse(requestBody);
    if (!validationResult.success) {
      return formatResponse(400, { 
        message: 'Invalid input', 
        errors: validationResult.error.errors 
      });
    }
    
    const { 
      leadId, 
      fileName, 
      fileType, 
      fileSize, 
      documentType, 
      description, 
      tags,
      isPublic 
    } = validationResult.data;
    
    // Generate a unique ID for the document
    const documentId = uuidv4();
    
    // Create S3 key (path in the bucket)
    const s3Key = `${leadId}/${documentId}/${fileName}`;
    
    // Get user ID from the request context (from Cognito)
    const userId = event.requestContext.authorizer?.claims?.sub || 'unknown-user';
    
    // Generate pre-signed URL for upload
    const uploadUrl = await s3GetUploadUrl(s3Key, fileType);
    
    // Create document metadata
    const now = new Date().toISOString();
    const document: Document = {
      id: documentId,
      leadId,
      fileName,
      fileType,
      fileSize,
      documentType,
      description,
      s3Key,
      uploadedBy: userId,
      uploadedAt: now,
      updatedAt: now,
      tags,
      isPublic: isPublic || false,
    };
    
    // Save document metadata to DynamoDB
    await putItem<Document>(DOCUMENTS_TABLE, document);
    
    return formatResponse(200, {
      documentId,
      uploadUrl,
      document,
    });
  } catch (error) {
    console.error('Error generating upload URL:', error);
    return formatResponse(500, { message: 'Internal server error' });
  }
};

// Generate a pre-signed URL for downloading a document
export const getDownloadUrl = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    // Get document ID from path parameters
    const documentId = event.pathParameters?.id;
    if (!documentId) {
      return formatResponse(400, { message: 'Document ID is required' });
    }
    
    // Get document metadata from DynamoDB
    const document = await getItem<Document>(DOCUMENTS_TABLE, documentId);
    if (!document) {
      return formatResponse(404, { message: 'Document not found' });
    }
    
    // Get user ID from the request context (from Cognito)
    const userId = event.requestContext.authorizer?.claims?.sub || 'unknown-user';
    
    // Check if user has access to the document
    // Users can access documents they uploaded or documents that are public
    if (!document.isPublic && document.uploadedBy !== userId) {
      // In a real application, you would check if the user has access to the lead
      // For simplicity, we're just checking if they uploaded the document
      return formatResponse(403, { message: 'Access denied' });
    }
    
    // Generate pre-signed URL for download
    const downloadUrl = await s3GetDownloadUrl(document.s3Key);
    
    return formatResponse(200, {
      documentId,
      downloadUrl,
      document,
    });
  } catch (error) {
    console.error('Error generating download URL:', error);
    return formatResponse(500, { message: 'Internal server error' });
  }
};

// Update document metadata
export const update = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    // Get document ID from path parameters
    const documentId = event.pathParameters?.id;
    if (!documentId) {
      return formatResponse(400, { message: 'Document ID is required' });
    }
    
    // Parse request body
    const requestBody = JSON.parse(event.body || '{}');
    
    // Validate input
    const validationResult = updateDocumentSchema.safeParse(requestBody);
    if (!validationResult.success) {
      return formatResponse(400, { 
        message: 'Invalid input', 
        errors: validationResult.error.errors 
      });
    }
    
    // Get document metadata from DynamoDB
    const document = await getItem<Document>(DOCUMENTS_TABLE, documentId);
    if (!document) {
      return formatResponse(404, { message: 'Document not found' });
    }
    
    // Get user ID from the request context (from Cognito)
    const userId = event.requestContext.authorizer?.claims?.sub || 'unknown-user';
    
    // Check if user has access to update the document
    if (document.uploadedBy !== userId) {
      return formatResponse(403, { message: 'Access denied' });
    }
    
    // Update document metadata
    const updatedDocument = await updateItem<Document>(
      DOCUMENTS_TABLE,
      documentId,
      validationResult.data
    );
    
    return formatResponse(200, updatedDocument);
  } catch (error) {
    console.error('Error updating document metadata:', error);
    return formatResponse(500, { message: 'Internal server error' });
  }
};

// Delete a document
export const deleteDocument = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    // Get document ID from path parameters
    const documentId = event.pathParameters?.id;
    if (!documentId) {
      return formatResponse(400, { message: 'Document ID is required' });
    }
    
    // Get document metadata from DynamoDB
    const document = await getItem<Document>(DOCUMENTS_TABLE, documentId);
    if (!document) {
      return formatResponse(404, { message: 'Document not found' });
    }
    
    // Get user ID from the request context (from Cognito)
    const userId = event.requestContext.authorizer?.claims?.sub || 'unknown-user';
    
    // Check if user has access to delete the document
    if (document.uploadedBy !== userId) {
      return formatResponse(403, { message: 'Access denied' });
    }
    
    // Delete document from S3
    await deleteObject(DOCUMENTS_BUCKET, document.s3Key);
    
    // Delete document metadata from DynamoDB
    await deleteItem(DOCUMENTS_TABLE, documentId);
    
    return formatResponse(204, null);
  } catch (error) {
    console.error('Error deleting document:', error);
    return formatResponse(500, { message: 'Internal server error' });
  }
};

// List documents with filtering and pagination
export const list = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    // Parse query parameters
    const queryParams = event.queryStringParameters || {};
    
    // Validate query parameters
    const validationResult = documentQuerySchema.safeParse(queryParams);
    if (!validationResult.success) {
      return formatResponse(400, { 
        message: 'Invalid query parameters', 
        errors: validationResult.error.errors 
      });
    }
    
    const { 
      leadId, 
      documentType, 
      uploadedBy, 
      fromDate, 
      toDate, 
      searchTerm,
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
      const { items: documents, lastEvaluatedKey } = await queryItems<Document>(
        DOCUMENTS_TABLE,
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
        documents,
        nextToken: newNextToken,
        count: documents.length,
      });
    }
    
    // Otherwise, scan the table with filters
    let filterExpressions: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};
    
    // Add documentType filter
    if (documentType) {
      filterExpressions.push('#documentType = :documentType');
      expressionAttributeNames['#documentType'] = 'documentType';
      expressionAttributeValues[':documentType'] = documentType;
    }
    
    // Add uploadedBy filter
    if (uploadedBy) {
      filterExpressions.push('#uploadedBy = :uploadedBy');
      expressionAttributeNames['#uploadedBy'] = 'uploadedBy';
      expressionAttributeValues[':uploadedBy'] = uploadedBy;
    }
    
    // Add date range filter
    if (fromDate && toDate) {
      filterExpressions.push('#uploadedAt BETWEEN :fromDate AND :toDate');
      expressionAttributeNames['#uploadedAt'] = 'uploadedAt';
      expressionAttributeValues[':fromDate'] = fromDate;
      expressionAttributeValues[':toDate'] = toDate;
    } else if (fromDate) {
      filterExpressions.push('#uploadedAt >= :fromDate');
      expressionAttributeNames['#uploadedAt'] = 'uploadedAt';
      expressionAttributeValues[':fromDate'] = fromDate;
    } else if (toDate) {
      filterExpressions.push('#uploadedAt <= :toDate');
      expressionAttributeNames['#uploadedAt'] = 'uploadedAt';
      expressionAttributeValues[':toDate'] = toDate;
    }
    
    // Add search term filter (search in fileName and description)
    if (searchTerm) {
      const searchFilters = [
        'contains(#fileName, :searchTerm)',
        'contains(#description, :searchTerm)'
      ];
      filterExpressions.push(`(${searchFilters.join(' OR ')})`);
      expressionAttributeNames['#fileName'] = 'fileName';
      expressionAttributeNames['#description'] = 'description';
      expressionAttributeValues[':searchTerm'] = searchTerm;
    }
    
    // Get user ID from the request context (from Cognito)
    const userId = event.requestContext.authorizer?.claims?.sub || 'unknown-user';
    
    // Add filter to only show documents the user has access to
    // (documents they uploaded or public documents)
    filterExpressions.push('(#uploadedBy = :userId OR #isPublic = :isPublic)');
    expressionAttributeNames['#uploadedBy'] = 'uploadedBy';
    expressionAttributeNames['#isPublic'] = 'isPublic';
    expressionAttributeValues[':userId'] = userId;
    expressionAttributeValues[':isPublic'] = true;
    
    // Combine filter expressions
    const filterExpression = filterExpressions.join(' AND ');
    
    // Query DynamoDB for documents
    const { items: documents, lastEvaluatedKey } = await queryItems<Document>(
      DOCUMENTS_TABLE,
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
      documents,
      nextToken: newNextToken,
      count: documents.length,
    });
  } catch (error) {
    console.error('Error listing documents:', error);
    return formatResponse(500, { message: 'Internal server error' });
  }
};

// Export the delete function with the correct name for Lambda
export { deleteDocument as delete }; 