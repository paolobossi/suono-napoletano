#!/bin/bash

# Deploy script to ensure ads.txt is properly included in production

# Make sure we're in the project root directory
cd "$(dirname "$0")"

# Ensure ads.txt is in the root directory for deployment
if [ ! -f "./ads.txt" ]; then
  echo "Error: ads.txt not found in the root directory"
  exit 1
fi

# Make sure it's also copied to other locations for redundancy
# In public directory
mkdir -p ./public
cp ./ads.txt ./public/ads.txt

# Make sure it's included in the client dist directory
mkdir -p ./client/dist/client
cp ./ads.txt ./client/dist/client/ads.txt

# Display success message
echo "ads.txt has been copied to all necessary locations for deployment"

# IMPORTANT: For Replit deployments, make sure to:
# 1. Set up proper routing in server/routes.ts (already done)
# 2. Make a direct GET request to the site root:
echo ""
echo "After deployment, please test with: curl -L https://suononapoletano.com/ads.txt"
echo "It should return: google.com, pub-1733624280085328, DIRECT, f08c47fec0942fa0"