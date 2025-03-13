import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Initialize S3 client
const s3Client = new S3Client({});

// Bucket names from environment variables
const DOCUMENTS_BUCKET = process.env.DOCUMENTS_BUCKET || '';
const RECORDINGS_BUCKET = process.env.RECORDINGS_BUCKET || '';

/**
 * Generate a pre-signed URL for uploading a document to S3
 */
export const getUploadUrl = async (
  key: string,
  contentType: string,
  expiresIn: number = 3600
): Promise<string> => {
  const command = new PutObjectCommand({
    Bucket: DOCUMENTS_BUCKET,
    Key: key,
    ContentType: contentType,
  });

  try {
    const url = await getSignedUrl(s3Client, command, { expiresIn });
    return url;
  } catch (error) {
    console.error('Error generating upload URL:', error);
    throw error;
  }
};

/**
 * Generate a pre-signed URL for downloading a document from S3
 */
export const getDownloadUrl = async (
  key: string,
  expiresIn: number = 3600
): Promise<string> => {
  const command = new GetObjectCommand({
    Bucket: DOCUMENTS_BUCKET,
    Key: key,
  });

  try {
    const url = await getSignedUrl(s3Client, command, { expiresIn });
    return url;
  } catch (error) {
    console.error('Error generating download URL:', error);
    throw error;
  }
};

/**
 * Generate a pre-signed URL for downloading a call recording from S3
 */
export const getRecordingUrl = async (
  key: string,
  expiresIn: number = 3600
): Promise<string> => {
  const command = new GetObjectCommand({
    Bucket: RECORDINGS_BUCKET,
    Key: key,
  });

  try {
    const url = await getSignedUrl(s3Client, command, { expiresIn });
    return url;
  } catch (error) {
    console.error('Error generating recording URL:', error);
    throw error;
  }
};

/**
 * Delete an object from S3
 */
export const deleteObject = async (bucket: string, key: string): Promise<void> => {
  const command = new DeleteObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  try {
    await s3Client.send(command);
  } catch (error) {
    console.error('Error deleting object from S3:', error);
    throw error;
  }
};

// Export bucket names
export { DOCUMENTS_BUCKET, RECORDINGS_BUCKET }; 