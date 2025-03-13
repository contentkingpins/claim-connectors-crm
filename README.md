# Claim Connectors CRM

A comprehensive CRM system for managing insurance claims, documents, and client communications.

## Features

- User authentication with AWS Cognito
- Role-based access control (Admin, Agent, Firm)
- Document management with AWS S3
- Call recording and management
- Lead tracking and management
- Secure API with AWS Lambda and API Gateway

## Tech Stack

### Frontend
- React with TypeScript
- Material UI for components
- AWS Amplify for authentication
- React Router for navigation

### Backend
- AWS Lambda functions
- DynamoDB for data storage
- S3 for document storage
- API Gateway for RESTful API

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- AWS account with appropriate permissions
- AWS CLI configured locally

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
REACT_APP_AWS_REGION=us-east-1
REACT_APP_USER_POOL_ID=your-user-pool-id
REACT_APP_USER_POOL_CLIENT_ID=your-user-pool-client-id
REACT_APP_API_ENDPOINT=your-api-gateway-endpoint
REACT_APP_DOCUMENTS_BUCKET=your-s3-bucket-name
```

## Installation

1. Clone the repository:
```
git clone https://github.com/your-username/claim-connectors-crm.git
cd claim-connectors-crm
```

2. Install dependencies:
```
npm install
```

3. Start the development server:
```
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

## Project Structure

```
claim-connectors-crm/
├── backend/                 # Backend Lambda functions
│   ├── src/
│   │   ├── api/             # API handlers
│   │   ├── models/          # Data models
│   │   └── utils/           # Utility functions
│   └── package.json
├── frontend/                # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── context/         # React context providers
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service functions
│   │   ├── types/           # TypeScript type definitions
│   │   ├── utils/           # Utility functions
│   │   ├── App.tsx          # Main App component
│   │   └── index.tsx        # Entry point
│   └── package.json
├── .env                     # Environment variables
├── package.json
└── README.md
```

## Deployment

### Frontend

1. Build the React app:
```
npm run build
```

2. Deploy to AWS Amplify or your preferred hosting service.

### Backend

1. Navigate to the backend directory:
```
cd backend
```

2. Install dependencies:
```
npm install
```

3. Deploy using AWS SAM or your preferred deployment method:
```
sam build
sam deploy --guided
```

## License

This project is licensed under the MIT License - see the LICENSE file for details. 