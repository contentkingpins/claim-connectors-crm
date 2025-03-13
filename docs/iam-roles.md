# IAM Roles for Claim Connectors CRM

This document outlines the IAM roles used in the Claim Connectors CRM system, following the principle of least privilege.

## Role Definitions

### 1. API Lambda Execution Role

**Role Name**: `claim-connectors-crm-lambda-execution-role`

**Description**: Used by Lambda functions that handle API requests.

**Permissions**:
- DynamoDB: Read/Write access to specific tables
- S3: Read/Write access to specific buckets
- CloudWatch: Log creation and writing
- X-Ray: Trace submission (for debugging)

**Trust Relationship**:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

**Inline Policy**:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem",
        "dynamodb:Query",
        "dynamodb:Scan"
      ],
      "Resource": [
        "arn:aws:dynamodb:*:*:table/claim-connectors-crm-leads-*",
        "arn:aws:dynamodb:*:*:table/claim-connectors-crm-documents-*",
        "arn:aws:dynamodb:*:*:table/claim-connectors-crm-calls-*",
        "arn:aws:dynamodb:*:*:table/claim-connectors-crm-documents-*/index/*",
        "arn:aws:dynamodb:*:*:table/claim-connectors-crm-calls-*/index/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": [
        "arn:aws:s3:::claim-connectors-crm-documents-*/*",
        "arn:aws:s3:::claim-connectors-crm-recordings-*/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "xray:PutTraceSegments",
        "xray:PutTelemetryRecords"
      ],
      "Resource": "*"
    }
  ]
}
```

### 2. Connect Integration Role

**Role Name**: `claim-connectors-crm-connect-integration-role`

**Description**: Used by Lambda functions triggered by Amazon Connect events.

**Permissions**:
- Connect: Read call metadata
- S3: Write access to recordings bucket
- DynamoDB: Write access to calls table
- CloudWatch: Log creation and writing

**Trust Relationship**:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": [
          "lambda.amazonaws.com",
          "connect.amazonaws.com"
        ]
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

**Inline Policy**:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "connect:GetContactAttributes",
        "connect:GetCurrentMetricData",
        "connect:GetMetricData"
      ],
      "Resource": "arn:aws:connect:*:*:instance/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject"
      ],
      "Resource": "arn:aws:s3:::claim-connectors-crm-recordings-*/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:PutItem"
      ],
      "Resource": "arn:aws:dynamodb:*:*:table/claim-connectors-crm-calls-*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:*"
    }
  ]
}
```

### 3. Cognito Authenticated Role

**Role Name**: `claim-connectors-crm-cognito-authenticated-role`

**Description**: Assumed by authenticated users through Cognito Identity Pool.

**Permissions**:
- API Gateway: Execute API methods
- S3: Read/Write to specific user folders
- CloudWatch: Submit client-side metrics

**Trust Relationship**:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "cognito-identity.amazonaws.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "cognito-identity.amazonaws.com:aud": "us-east-1:12345678-1234-1234-1234-123456789012"
        },
        "ForAnyValue:StringLike": {
          "cognito-identity.amazonaws.com:amr": "authenticated"
        }
      }
    }
  ]
}
```

**Inline Policy**:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "execute-api:Invoke"
      ],
      "Resource": "arn:aws:execute-api:*:*:*/*/GET/*",
      "Condition": {
        "StringEquals": {
          "aws:SourceVpc": "vpc-12345678"
        }
      }
    },
    {
      "Effect": "Allow",
      "Action": [
        "execute-api:Invoke"
      ],
      "Resource": "arn:aws:execute-api:*:*:*/*/POST/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "execute-api:Invoke"
      ],
      "Resource": "arn:aws:execute-api:*:*:*/*/PUT/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "execute-api:Invoke"
      ],
      "Resource": "arn:aws:execute-api:*:*:*/*/DELETE/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject"
      ],
      "Resource": [
        "arn:aws:s3:::claim-connectors-crm-documents-*/${cognito-identity.amazonaws.com:sub}/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "cloudwatch:PutMetricData"
      ],
      "Resource": "*",
      "Condition": {
        "StringEquals": {
          "cloudwatch:namespace": "ClaimConnectorsCRM/ClientMetrics"
        }
      }
    }
  ]
}
```

### 4. CI/CD Pipeline Role

**Role Name**: `claim-connectors-crm-cicd-role`

**Description**: Used by CI/CD services to deploy the application.

**Permissions**:
- CloudFormation: Create/Update/Delete stacks
- S3: Read/Write to deployment buckets
- Lambda: Update functions
- API Gateway: Create/Update/Delete resources
- IAM: Pass role to services
- CloudWatch: Create/Update alarms

**Trust Relationship**:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "codebuild.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    },
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "codepipeline.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

**Inline Policy**: (Abbreviated for brevity)
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "cloudformation:CreateStack",
        "cloudformation:UpdateStack",
        "cloudformation:DeleteStack",
        "cloudformation:DescribeStacks",
        "cloudformation:ValidateTemplate"
      ],
      "Resource": "arn:aws:cloudformation:*:*:stack/claim-connectors-crm-*/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::claim-connectors-crm-deployment-*",
        "arn:aws:s3:::claim-connectors-crm-deployment-*/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "lambda:UpdateFunctionCode",
        "lambda:UpdateFunctionConfiguration",
        "lambda:GetFunction",
        "lambda:CreateFunction",
        "lambda:DeleteFunction",
        "lambda:ListVersionsByFunction",
        "lambda:PublishVersion",
        "lambda:UpdateAlias",
        "lambda:CreateAlias",
        "lambda:DeleteAlias"
      ],
      "Resource": "arn:aws:lambda:*:*:function:claim-connectors-crm-*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "apigateway:GET",
        "apigateway:POST",
        "apigateway:PUT",
        "apigateway:DELETE",
        "apigateway:PATCH"
      ],
      "Resource": [
        "arn:aws:apigateway:*::/restapis",
        "arn:aws:apigateway:*::/restapis/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": "iam:PassRole",
      "Resource": [
        "arn:aws:iam::*:role/claim-connectors-crm-*"
      ]
    }
  ]
}
```

## Security Best Practices

1. **Regular Rotation**: Access keys are rotated every 90 days.
2. **Audit Logging**: All role usage is logged via CloudTrail.
3. **Least Privilege**: Roles have minimal permissions needed for their function.
4. **Conditions**: Where possible, conditions limit when permissions can be used.
5. **Resource Constraints**: Permissions are scoped to specific resources.
6. **No Wildcard Permissions**: Avoid * permissions except where absolutely necessary.

## Role Assignment Process

1. Development environments use more permissive roles for iteration speed.
2. Staging and production environments use strictly limited roles.
3. All role changes require peer review and security team approval.
4. Role permissions are automatically tested against security policies.
5. Unused permissions are regularly audited and removed. 