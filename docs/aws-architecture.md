# AWS Architecture for Claim Connectors CRM

## High-Level Architecture Diagram

```
┌─────────────────┐     ┌───────────────┐     ┌─────────────────┐
│                 │     │               │     │                 │
│  React Frontend │────▶│  API Gateway  │────▶│  Lambda Functions│
│                 │     │               │     │                 │
└─────────────────┘     └───────────────┘     └────────┬────────┘
        │                                              │
        │                                              │
        │                                              ▼
        │                                     ┌─────────────────┐
        │                                     │                 │
        │                                     │    DynamoDB     │
        │                                     │                 │
        │                                     └─────────────────┘
        │                                              ▲
        │                                              │
        │                                              │
┌───────▼───────┐                             ┌────────┴────────┐
│               │                             │                 │
│  Amazon       │                             │  S3 Buckets     │
│  Cognito      │                             │  (Documents &   │
│               │                             │   Recordings)   │
└───────────────┘                             └─────────────────┘
        │                                              ▲
        │                                              │
        ▼                                              │
┌─────────────────┐                           ┌────────┴────────┐
│                 │                           │                 │
│  Amazon Connect │──────────────────────────▶│  Lambda Triggers│
│                 │                           │                 │
└─────────────────┘                           └─────────────────┘
```

## Service Descriptions

### Frontend
- **React Application**: Single-page application built with React, Redux, and Material-UI
- **AWS Amplify**: For authentication, API calls, and S3 uploads
- **Hosting**: Deployed via AWS Amplify Console or S3 with CloudFront

### Authentication & Authorization
- **Amazon Cognito**: User pools for authentication and identity pools for AWS service access
- **IAM Roles**: Fine-grained access control for AWS services

### API Layer
- **API Gateway**: RESTful API endpoints with CORS support
- **Lambda Authorizer**: Validates JWT tokens from Cognito

### Backend Processing
- **Lambda Functions**: Serverless functions written in TypeScript
- **Function Categories**:
  - Lead Management (CRUD operations)
  - Document Management (upload/download URLs, metadata)
  - Call Management (metadata storage, recording access)

### Data Storage
- **DynamoDB Tables**:
  - Leads: Stores lead information
  - Documents: Stores document metadata with lead associations
  - Calls: Stores call metadata with lead associations
- **S3 Buckets**:
  - Documents: Stores uploaded documents with server-side encryption
  - Recordings: Stores call recordings from Amazon Connect

### Call Center Integration
- **Amazon Connect**: Cloud-based contact center
- **Connect Integration**: Lambda functions triggered by call events
- **Recording Storage**: Automatic storage of call recordings in S3

## Security Considerations

### Data Encryption
- All data encrypted at rest using AWS-managed keys (SSE-S3)
- All data encrypted in transit using TLS/HTTPS

### Access Control
- Principle of least privilege applied to all IAM roles
- API access controlled via Cognito authentication
- S3 access controlled via signed URLs with expiration

### Compliance
- Audit logging via CloudTrail
- Call recording compliance with relevant regulations

## Service Limits and Quotas

| Service | Resource | Default Limit | Project Usage |
|---------|----------|---------------|--------------|
| Lambda | Concurrent executions | 1,000 | <100 |
| DynamoDB | Read capacity units | On-demand | Variable |
| DynamoDB | Write capacity units | On-demand | Variable |
| S3 | Buckets per account | 100 | 2 |
| API Gateway | Requests per second | 10,000 | <1,000 |
| Connect | Concurrent calls | Varies by instance | <50 |

## Scaling Considerations

- DynamoDB tables use on-demand capacity for automatic scaling
- Lambda functions scale automatically with request volume
- API Gateway can handle thousands of concurrent requests
- S3 provides virtually unlimited storage capacity

## Cost Optimization

- Lambda functions sized appropriately for workload
- DynamoDB on-demand pricing for unpredictable workloads
- S3 lifecycle policies to transition older recordings to cheaper storage tiers
- CloudWatch alarms for cost monitoring 