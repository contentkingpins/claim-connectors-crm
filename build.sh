#!/bin/bash

# Navigate to the frontend directory
cd frontend

# Install dependencies with legacy peer deps
npm ci --legacy-peer-deps

# Install ajv explicitly to fix the build issue
npm install ajv@6.12.6 --no-save --legacy-peer-deps

# Build the frontend
npm run build

echo "Build completed. Check the frontend/build directory for the output." 