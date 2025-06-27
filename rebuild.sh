#!/bin/bash

# Clear previous builds
rm -rf .next

# Install dependencies if needed
npm install

# Build the project
npm run build

# Start the production server
npm run start
