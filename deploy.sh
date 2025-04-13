#!/bin/bash

# Deploy script to ensure ads.txt is properly included in production

# Make sure we're in the project root directory
cd "$(dirname "$0")"

# Create a directory for ads.txt and other public files in the root of the site
mkdir -p ./ads

# Copy the ads.txt file to the ads directory
cp ./public/ads.txt ./ads/

# Display success message
echo "ads.txt has been copied to the site root for deployment"

# Note: This script should be run manually before deployment
# After deployment, make sure your hosting service is configured
# to serve the ads.txt file from the root of your domain.