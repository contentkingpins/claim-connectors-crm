#!/bin/bash

# Navigate to the frontend directory
cd frontend

# Clean up node_modules to avoid dependency conflicts
rm -rf node_modules

# Install dependencies with legacy peer deps
npm install --legacy-peer-deps

# Install specific versions of problematic dependencies
npm install ajv@8.12.0 ajv-keywords@5.1.0 @craco/craco@7.1.0 cosmiconfig-typescript-loader@1.0.9 typescript@4.9.5 --legacy-peer-deps

# Ensure aws-exports.js exists
if [ ! -f src/aws-exports.js ]; then
  echo "Creating placeholder aws-exports.js"
  cat > src/aws-exports.js << EOL
// This file will be replaced by AWS Amplify when you connect your app
// This is just a placeholder to avoid import errors

const awsmobile = {
  "aws_project_region": "us-east-1",
  "aws_cognito_identity_pool_id": "PLACEHOLDER_IDENTITY_POOL_ID",
  "aws_cognito_region": "us-east-1",
  "aws_user_pools_id": "PLACEHOLDER_USER_POOL_ID",
  "aws_user_pools_web_client_id": "PLACEHOLDER_USER_POOL_CLIENT_ID",
  "oauth": {},
  "aws_cloud_logic_custom": [
    {
      "name": "api",
      "endpoint": "PLACEHOLDER_API_ENDPOINT",
      "region": "us-east-1"
    }
  ],
  "aws_user_files_s3_bucket": "PLACEHOLDER_S3_BUCKET",
  "aws_user_files_s3_bucket_region": "us-east-1"
};

export default awsmobile;
EOL
fi

# Build the frontend
npm run build

echo "Build completed. Check the frontend/build directory for the output." 