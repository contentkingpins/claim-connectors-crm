#!/bin/bash

# Navigate to the frontend directory
cd frontend

# Install dependencies with legacy peer deps
npm ci --legacy-peer-deps

# Build the frontend
npm run build

echo "Build completed. Check the frontend/build directory for the output." 