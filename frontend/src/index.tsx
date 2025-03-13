import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Amplify } from 'aws-amplify';

// Configure Amplify with default config or aws-exports if available
let awsConfig;
try {
  // Try to import aws-exports
  awsConfig = require('./aws-exports').default;
} catch (error) {
  // Fallback configuration if aws-exports.js is not available
  console.warn('aws-exports.js not found, using default configuration');
  awsConfig = {
    aws_project_region: process.env.REACT_APP_AWS_REGION || 'us-east-1',
    aws_cognito_identity_pool_id: process.env.REACT_APP_COGNITO_IDENTITY_POOL_ID || 'PLACEHOLDER_IDENTITY_POOL_ID',
    aws_cognito_region: process.env.REACT_APP_AWS_REGION || 'us-east-1',
    aws_user_pools_id: process.env.REACT_APP_USER_POOL_ID || 'PLACEHOLDER_USER_POOL_ID',
    aws_user_pools_web_client_id: process.env.REACT_APP_USER_POOL_CLIENT_ID || 'PLACEHOLDER_USER_POOL_CLIENT_ID',
    oauth: {},
    aws_cloud_logic_custom: [
      {
        name: 'api',
        endpoint: process.env.REACT_APP_API_ENDPOINT || 'PLACEHOLDER_API_ENDPOINT',
        region: process.env.REACT_APP_AWS_REGION || 'us-east-1'
      }
    ],
    aws_user_files_s3_bucket: process.env.REACT_APP_S3_BUCKET || 'PLACEHOLDER_S3_BUCKET',
    aws_user_files_s3_bucket_region: process.env.REACT_APP_AWS_REGION || 'us-east-1'
  };
}

// Configure Amplify
Amplify.configure(awsConfig);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(); 