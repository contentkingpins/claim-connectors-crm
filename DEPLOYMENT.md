# Claim Connectors CRM Deployment Guide

This guide provides instructions for deploying the Claim Connectors CRM application to AWS Amplify.

## Prerequisites

1. An AWS account with appropriate permissions
2. AWS Amplify CLI installed and configured
3. Git repository with the application code

## Deployment Steps

### 1. Set Up AWS Amplify

1. Log in to the AWS Management Console and navigate to AWS Amplify
2. Click "New app" and select "Host web app"
3. Choose your Git provider and connect to your repository
4. Select the repository and branch to deploy

### 2. Configure Build Settings

The repository includes an `amplify.yml` file that configures the build process. You can review and modify these settings in the Amplify Console if needed.

### 3. Configure Environment Variables

Set the following environment variables in the Amplify Console:

- `REACT_APP_AWS_REGION`: The AWS region where your resources are deployed (e.g., `us-east-1`)
- `REACT_APP_USER_POOL_ID`: Your Cognito User Pool ID
- `REACT_APP_USER_POOL_CLIENT_ID`: Your Cognito User Pool Client ID
- `REACT_APP_API_ENDPOINT`: Your API Gateway endpoint URL
- `REACT_APP_DOCUMENTS_BUCKET`: Your S3 bucket name for document storage
- `REACT_APP_USE_MOCK_API`: Set to `false` for production

### 4. Deploy Backend Resources

If you haven't already deployed the backend resources, follow these steps:

1. Navigate to the `backend` directory
2. Run `npm install` to install dependencies
3. Run `npm run deploy` to deploy the backend resources

### 5. Connect to AWS Amplify

1. In the Amplify Console, click "Save and deploy"
2. Wait for the build and deployment to complete
3. Once deployed, you can access your application at the provided URL

## Troubleshooting

### Build Failures

If the build fails, check the build logs in the Amplify Console for errors. Common issues include:

- **Dependency conflicts**: Check that the correct versions of dependencies are installed
- **Environment variables**: Ensure all required environment variables are set
- **Build configuration**: Verify that the build commands in `amplify.yml` are correct

### Runtime Errors

If the application deploys but doesn't work correctly:

1. Check the browser console for errors
2. Verify that the environment variables are correctly set
3. Ensure that the backend resources are properly deployed and accessible

## Updating the Deployment

To update the deployment:

1. Push changes to the connected Git repository
2. AWS Amplify will automatically detect the changes and start a new build
3. Monitor the build progress in the Amplify Console

## Monitoring and Logs

- View application logs in the Amplify Console
- Set up CloudWatch Alarms for monitoring application health
- Configure notifications for build and deployment events

## Security Considerations

- Ensure that your Cognito User Pool is properly configured with appropriate security settings
- Use IAM roles with least privilege for accessing AWS resources
- Enable HTTPS for all API endpoints
- Configure appropriate CORS settings for your API Gateway 