#!/bin/bash

# Navigate to the frontend directory
cd frontend

# Install dependencies with legacy peer deps
npm ci --legacy-peer-deps

# Install ajv, ajv-keywords, and CRACO explicitly to fix the build issue
npm install ajv@8.12.0 ajv-keywords@5.1.0 @craco/craco@7.1.0 --legacy-peer-deps

# Build the frontend
npm run build

echo "Build completed. Check the frontend/build directory for the output." 