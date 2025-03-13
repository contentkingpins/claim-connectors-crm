import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
  QueryCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';

// Initialize DynamoDB client
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

// Table names from environment variables
const LEADS_TABLE = process.env.LEADS_TABLE || '';
const DOCUMENTS_TABLE = process.env.DOCUMENTS_TABLE || '';
const CALLS_TABLE = process.env.CALLS_TABLE || '';

/**
 * Get an item from a DynamoDB table by its ID
 */
export const getItem = async <T>(tableName: string, id: string): Promise<T | null> => {
  const command = new GetCommand({
    TableName: tableName,
    Key: { id },
  });

  try {
    const response = await docClient.send(command);
    return (response.Item as T) || null;
  } catch (error) {
    console.error(`Error getting item from ${tableName}:`, error);
    throw error;
  }
};

/**
 * Put an item into a DynamoDB table
 */
export const putItem = async <T extends Record<string, any>>(tableName: string, item: T): Promise<T> => {
  const command = new PutCommand({
    TableName: tableName,
    Item: item,
  });

  try {
    await docClient.send(command);
    return item;
  } catch (error) {
    console.error(`Error putting item into ${tableName}:`, error);
    throw error;
  }
};

/**
 * Update an item in a DynamoDB table
 */
export const updateItem = async <T>(
  tableName: string,
  id: string,
  updates: Partial<T>
): Promise<T> => {
  // Build update expression and attribute values
  const updateExpressionParts: string[] = [];
  const expressionAttributeNames: Record<string, string> = {};
  const expressionAttributeValues: Record<string, any> = {};

  Object.entries(updates).forEach(([key, value]) => {
    if (key !== 'id') {
      updateExpressionParts.push(`#${key} = :${key}`);
      expressionAttributeNames[`#${key}`] = key;
      expressionAttributeValues[`:${key}`] = value;
    }
  });

  // Add updatedAt timestamp
  const now = new Date().toISOString();
  updateExpressionParts.push('#updatedAt = :updatedAt');
  expressionAttributeNames['#updatedAt'] = 'updatedAt';
  expressionAttributeValues[':updatedAt'] = now;

  const command = new UpdateCommand({
    TableName: tableName,
    Key: { id },
    UpdateExpression: `SET ${updateExpressionParts.join(', ')}`,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: 'ALL_NEW',
  });

  try {
    const response = await docClient.send(command);
    return response.Attributes as T;
  } catch (error) {
    console.error(`Error updating item in ${tableName}:`, error);
    throw error;
  }
};

/**
 * Delete an item from a DynamoDB table
 */
export const deleteItem = async (tableName: string, id: string): Promise<void> => {
  const command = new DeleteCommand({
    TableName: tableName,
    Key: { id },
  });

  try {
    await docClient.send(command);
  } catch (error) {
    console.error(`Error deleting item from ${tableName}:`, error);
    throw error;
  }
};

/**
 * Query items from a DynamoDB table by index
 */
export const queryItems = async <T>(
  tableName: string,
  indexName: string | undefined,
  keyConditionExpression: string,
  expressionAttributeNames: Record<string, string>,
  expressionAttributeValues: Record<string, any>,
  limit: number = 20,
  exclusiveStartKey?: Record<string, any>
): Promise<{ items: T[]; lastEvaluatedKey?: Record<string, any> }> => {
  const command = new QueryCommand({
    TableName: tableName,
    IndexName: indexName,
    KeyConditionExpression: keyConditionExpression,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    Limit: limit,
    ExclusiveStartKey: exclusiveStartKey,
  });

  try {
    const response = await docClient.send(command);
    return {
      items: (response.Items as T[]) || [],
      lastEvaluatedKey: response.LastEvaluatedKey,
    };
  } catch (error) {
    console.error(`Error querying items from ${tableName}:`, error);
    throw error;
  }
};

/**
 * Scan items from a DynamoDB table
 */
export const scanItems = async <T>(
  tableName: string,
  filterExpression?: string,
  expressionAttributeNames?: Record<string, string>,
  expressionAttributeValues?: Record<string, any>,
  limit: number = 20,
  exclusiveStartKey?: Record<string, any>
): Promise<{ items: T[]; lastEvaluatedKey?: Record<string, any> }> => {
  const command = new ScanCommand({
    TableName: tableName,
    FilterExpression: filterExpression,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    Limit: limit,
    ExclusiveStartKey: exclusiveStartKey,
  });

  try {
    const response = await docClient.send(command);
    return {
      items: (response.Items as T[]) || [],
      lastEvaluatedKey: response.LastEvaluatedKey,
    };
  } catch (error) {
    console.error(`Error scanning items from ${tableName}:`, error);
    throw error;
  }
};

// Export table names
export { LEADS_TABLE, DOCUMENTS_TABLE, CALLS_TABLE }; 